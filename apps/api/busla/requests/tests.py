"""Parent-request list / detail / approve / reject."""

from __future__ import annotations

from rest_framework.test import APIClient

from busla.fleet.models import Bus
from busla.notifications.models import Notification
from busla.people.models import Student
from busla.requests.models import ParentRequest

REQS = "/api/v1/requests/"


def make_request(school, **kw):
    bus = Bus.objects.create(school=school, bus_number="Bus 07", capacity=25, status="in_service")
    student = Student.objects.create(
        school=school, full_name="Kid One", area="New Cairo", address="Old address", status="scheduled"
    )
    defaults = dict(
        student=student, requested_address="New address, Shorouk", requested_area="Shorouk",
        reason="Moving house",
    )
    defaults.update(kw)
    return ParentRequest.objects.create(school=school, **defaults), student, bus


def test_list_shape_and_zone(admin_client, school):
    make_request(school)
    resp = admin_client.get(REQS)
    assert resp.status_code == 200
    row = resp.data["results"][0]
    assert set(row) == {"id", "name", "zone", "reason", "time", "group", "is_read", "status"}
    assert row["name"] == "Kid One"
    assert row["zone"] == "New Cairo → Shorouk"


def test_detail_has_suggestion(admin_client, school):
    req, _, bus = make_request(school)
    resp = admin_client.get(f"{REQS}{req.id}/")
    assert resp.status_code == 200
    assert set(resp.data) == {"id", "date", "current", "requested", "suggestion", "status"}
    assert resp.data["suggestion"]["bus"] == bus.bus_number
    assert resp.data["suggestion"]["seatsLeft"] == 25


def test_approve_applies_change_and_notifies(admin_client, school):
    req, student, bus = make_request(school)
    resp = admin_client.post(f"{REQS}{req.id}/approve/")
    assert resp.status_code == 200

    student.refresh_from_db()
    assert student.address == "New address, Shorouk"
    assert student.area == "Shorouk"
    assert student.bus_id == bus.id

    req.refresh_from_db()
    assert req.status == ParentRequest.Status.APPROVED
    assert Notification.objects.filter(school=school, kind=Notification.Kind.PARENT_REQUEST).exists()


def test_reject_sets_status(admin_client, school):
    req, _, _ = make_request(school)
    resp = admin_client.post(f"{REQS}{req.id}/reject/")
    assert resp.status_code == 200
    req.refresh_from_db()
    assert req.status == ParentRequest.Status.REJECTED


def test_tenant_scoped(admin_client, school, other_school):
    make_request(school)
    make_request(other_school)
    resp = admin_client.get(REQS)
    assert resp.data["count"] == 1


def test_admin_only(school):
    make_request(school)
    client = APIClient()
    assert client.get(REQS).status_code in (401, 403)
