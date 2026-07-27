"""Fleet API: CRUD, role permission, tenant scoping, filtering."""

from __future__ import annotations

from rest_framework.test import APIClient

from busla.fleet.models import Bus

BUSES = "/api/v1/buses/"


def test_admin_creates_and_lists_bus(admin_client):
    resp = admin_client.post(BUSES, {"bus_number": "Bus 05", "capacity": 25}, format="json")
    assert resp.status_code == 201
    assert resp.data["bus_number"] == "Bus 05"

    listed = admin_client.get(BUSES)
    assert listed.status_code == 200
    assert listed.data["count"] == 1


def test_parent_cannot_create_bus(parent_user):
    client = APIClient()
    client.force_authenticate(parent_user)
    assert client.post(BUSES, {"bus_number": "X"}, format="json").status_code == 403


def test_unauthenticated_is_rejected():
    assert APIClient().get(BUSES).status_code == 401


def test_bus_list_is_school_scoped(admin_client, school, other_school):
    Bus.objects.create(school=school, bus_number="Mine")
    Bus.objects.create(school=other_school, bus_number="Theirs")
    resp = admin_client.get(BUSES)
    assert resp.data["count"] == 1
    assert resp.data["results"][0]["bus_number"] == "Mine"


def test_filter_by_status_and_search(admin_client, school):
    Bus.objects.create(school=school, bus_number="A", status="issue")
    Bus.objects.create(school=school, bus_number="B", status="in_service")
    assert admin_client.get(f"{BUSES}?status=issue").data["count"] == 1
    assert admin_client.get(f"{BUSES}?search=B").data["count"] == 1


def test_delete_is_soft(admin_client, school):
    bus = Bus.objects.create(school=school, bus_number="Gone")
    resp = admin_client.delete(f"{BUSES}{bus.id}/")
    assert resp.status_code == 204
    bus.refresh_from_db()
    assert bus.is_deleted is True
    assert admin_client.get(BUSES).data["count"] == 0
