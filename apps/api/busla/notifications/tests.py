"""Notifications feed + shift-readiness board."""

from __future__ import annotations

from datetime import timedelta

from django.utils import timezone
from rest_framework.test import APIClient

from busla.people.models import Driver
from busla.notifications.models import DriverCheckIn, Notification

FEED = "/api/v1/notifications/"
UNREAD = "/api/v1/notifications/unread-count/"
READ_ALL = "/api/v1/notifications/read-all/"
BOARD = "/api/v1/shift-readiness/"


def make_notifs(school):
    now = timezone.now()
    Notification.objects.create(school=school, kind=Notification.Kind.BREAKDOWN, title="Bus 12 Breakdown", occurred_at=now - timedelta(minutes=5), is_read=False)
    Notification.objects.create(school=school, kind=Notification.Kind.DELAY, title="Delay", occurred_at=now - timedelta(hours=1), is_read=False)
    Notification.objects.create(school=school, kind=Notification.Kind.COMPLETED, title="Done", occurred_at=now - timedelta(days=1), is_read=True)
    Notification.objects.create(school=school, kind=Notification.Kind.INFO, title="Old", occurred_at=now - timedelta(days=6), is_read=True)


def test_feed_shape_and_grouping(admin_client, school):
    make_notifs(school)
    resp = admin_client.get(FEED)
    assert resp.status_code == 200
    assert len(resp.data) == 4
    first = resp.data[0]
    assert set(first) == {"id", "kind", "title", "subtitle", "time", "group", "is_read"}
    groups = [n["group"] for n in resp.data]
    assert groups[0] == "today"
    assert "yesterday" in groups
    assert "earlier" in groups


def test_unread_count_and_read_all(admin_client, school):
    make_notifs(school)
    assert admin_client.get(UNREAD).data["count"] == 2
    assert admin_client.post(READ_ALL).status_code == 200
    assert admin_client.get(UNREAD).data["count"] == 0


def test_read_single_flips_one(admin_client, school):
    make_notifs(school)
    unread = Notification.objects.filter(school=school, is_read=False).first()
    resp = admin_client.post(f"{FEED}{unread.id}/read/")
    assert resp.status_code == 200
    assert resp.data["is_read"] is True
    assert admin_client.get(UNREAD).data["count"] == 1


def test_feed_is_tenant_scoped(admin_client, school, other_school):
    make_notifs(school)
    Notification.objects.create(school=other_school, kind=Notification.Kind.INFO, title="Foreign")
    resp = admin_client.get(FEED)
    assert all(n["title"] != "Foreign" for n in resp.data)


def test_admin_only(school):
    make_notifs(school)
    client = APIClient()
    assert client.get(FEED).status_code in (401, 403)


# --- Shift readiness ---

def make_drivers(school):
    d1 = Driver.objects.create(school=school, full_name="A Driver", status="active")
    d2 = Driver.objects.create(school=school, full_name="B Driver", status="off_duty")
    today = timezone.localdate()
    ci1 = DriverCheckIn.objects.create(school=school, driver=d1, service_date=today, shift="morning", state=DriverCheckIn.State.CHECKED_IN)
    ci2 = DriverCheckIn.objects.create(school=school, driver=d2, service_date=today, shift="morning", state=DriverCheckIn.State.PENDING, pending_minutes=12)
    return ci1, ci2


def test_board_summary_and_checkins(admin_client, school):
    make_drivers(school)
    resp = admin_client.get(BOARD)
    assert resp.status_code == 200
    assert resp.data["summary"]["checkedIn"] == 1
    assert resp.data["summary"]["total"] == 2
    assert len(resp.data["checkins"]) == 2
    assert set(resp.data["checkins"][0]) == {"id", "name", "bus", "state", "detail"}


def test_remind_creates_notification(admin_client, school):
    ci1, _ = make_drivers(school)
    before = Notification.objects.filter(school=school, kind=Notification.Kind.REMINDER).count()
    resp = admin_client.post(f"{BOARD}{ci1.id}/remind/")
    assert resp.status_code == 200
    after = Notification.objects.filter(school=school, kind=Notification.Kind.REMINDER).count()
    assert after == before + 1


def test_substitutes_returns_active_drivers(admin_client, school):
    make_drivers(school)
    resp = admin_client.get(f"{BOARD}substitutes/")
    assert resp.status_code == 200
    names = [d["name"] for d in resp.data]
    assert "A Driver" in names  # active
    assert "B Driver" not in names  # off_duty
