"""Trips API: live journeys, detail timeline, logs, position ingest, overview."""

from __future__ import annotations

from datetime import time, timedelta

from django.utils import timezone
from rest_framework.test import APIClient

from busla.fleet.models import Bus
from busla.people.models import Student
from busla.requests.models import ParentRequest
from busla.routing.models import Route, RouteStop
from busla.trips.models import Trip
from busla.trips.views import _period_start

LIVE = "/api/v1/trips/live/"
LOGS = "/api/v1/trips/logs/"
OVERVIEW = "/api/v1/trips/overview/"


def make_route(school, code="R-01", n_stops=3):
    bus = Bus.objects.create(school=school, bus_number=f"Bus {code}", capacity=25, status="in_service")
    route = Route.objects.create(school=school, code=code, name="Test Route", bus=bus, distance_km=10, duration_min=30)
    for i in range(n_stops):
        RouteStop.objects.create(
            route=route, sequence=i + 1, kind="student", label=f"Stop {i}",
            latitude=30.0 + i * 0.01, longitude=31.0, eta=time(6, i),
        )
    Student.objects.create(school=school, full_name="S1", route=route, bus=bus, status="scheduled")
    return route, bus


def make_trip(school, route, bus, **kw):
    defaults = dict(
        service_date=timezone.localdate(), shift="morning", status=Trip.Status.ON_TIME,
        current_stop_index=1, current_lat=30.01, current_lng=31.0, last_ping_at=timezone.now(),
    )
    defaults.update(kw)
    return Trip.objects.create(school=school, route=route, bus=bus, **defaults)


def test_live_returns_active_trips_in_journey_shape(admin_client, school):
    route, bus = make_route(school)
    make_trip(school, route, bus)  # active
    make_trip(school, route, bus, status=Trip.Status.DELAYED, actual_arrival=time(7, 30))  # finished → log, not live

    resp = admin_client.get(LIVE)
    assert resp.status_code == 200
    assert len(resp.data) == 1
    j = resp.data[0]
    assert j["bus"] == bus.bus_number
    assert j["status"] == "On-time"
    assert j["occupied"] == 1
    assert j["capacity"] == 25
    assert j["latitude"] == 30.01


def test_trip_detail_has_timeline(admin_client, school):
    route, bus = make_route(school, n_stops=3)
    trip = make_trip(school, route, bus, current_stop_index=1)
    resp = admin_client.get(f"/api/v1/trips/{trip.id}/")
    assert resp.status_code == 200
    tl = resp.data["timeline"]
    assert [s["status"] for s in tl] == ["completed", "current", "upcoming"]
    assert resp.data["stops"] == 3


def test_logs_lists_finished_and_filters(admin_client, school):
    route, bus = make_route(school)
    make_trip(school, route, bus, status=Trip.Status.ON_TIME, actual_arrival=time(7, 30))
    make_trip(school, route, bus, status=Trip.Status.DELAYED, delay_minutes=8, actual_arrival=time(7, 38))
    make_trip(school, route, bus)  # active → excluded from logs

    resp = admin_client.get(LOGS)
    assert resp.data["count"] == 2
    delayed = admin_client.get(f"{LOGS}?status=delayed")
    assert delayed.data["count"] == 1
    assert delayed.data["results"][0]["statusLabel"] == "Delayed 8m"


def test_position_ingest_updates_last_known(admin_client, school):
    route, bus = make_route(school)
    trip = make_trip(school, route, bus)
    resp = admin_client.post(f"/api/v1/trips/{trip.id}/position/", {"latitude": 30.5, "longitude": 31.5}, format="json")
    assert resp.status_code == 200
    trip.refresh_from_db()
    assert trip.current_lat == 30.5 and trip.current_lng == 31.5
    assert trip.last_ping_at is not None


def test_overview_segments_actions_pins(admin_client, school):
    route, bus = make_route(school)
    make_trip(school, route, bus, status=Trip.Status.BROKEN_DOWN)
    resp = admin_client.get(OVERVIEW)
    assert resp.status_code == 200
    issues = next(s for s in resp.data["trip_segments"] if s["key"] == "issues")
    assert issues["value"] >= 1
    assert any(a["kind"] == "breakdown" for a in resp.data["action_required"])
    assert len(resp.data["map_pins"]) >= 1


def test_period_start_helper():
    from datetime import date

    wed = date(2026, 7, 15)  # a Wednesday
    assert _period_start("today", wed) == wed
    assert _period_start("week", wed) == date(2026, 7, 13)  # Monday of that week
    assert _period_start("month", wed) == date(2026, 7, 1)
    assert _period_start("bogus", wed) == wed  # unknown → today


def test_overview_default_is_today_only(admin_client, school):
    route, bus = make_route(school)
    make_trip(school, route, bus, actual_arrival=time(7, 30))  # today, completed
    old = timezone.localdate() - timedelta(days=40)
    make_trip(school, route, bus, service_date=old, actual_arrival=time(7, 30))  # last month

    total = sum(s["value"] for s in admin_client.get(OVERVIEW).data["trip_segments"])
    assert total == 1  # the 40-day-old trip is outside the default (today) window


def test_overview_segments_are_mutually_exclusive(admin_client, school):
    route, bus = make_route(school)
    # A delayed trip that has already arrived must count once (completed), not twice.
    make_trip(school, route, bus, status=Trip.Status.DELAYED, actual_arrival=time(7, 40))

    segs = {s["key"]: s["value"] for s in admin_client.get(OVERVIEW).data["trip_segments"]}
    assert segs["completed"] == 1
    assert segs["delayed"] == 0
    assert sum(segs.values()) == 1  # no double-count


def test_overview_delayed_action_kind_is_distinct(admin_client, school):
    route, bus = make_route(school)
    make_trip(school, route, bus, status=Trip.Status.DELAYED, delay_minutes=12)  # active, delayed
    kinds = [a["kind"] for a in admin_client.get(OVERVIEW).data["action_required"]]
    assert "delayed" in kinds
    assert "absent" not in kinds  # delayed trips are no longer mislabelled


def test_overview_surfaces_pending_parent_requests(admin_client, school):
    route, bus = make_route(school)
    student = Student.objects.create(school=school, full_name="Kid A", area="New Cairo", status="scheduled")
    ParentRequest.objects.create(
        school=school, student=student, requested_area="Shorouk", reason="Moving house",
    )
    actions = admin_client.get(OVERVIEW).data["action_required"]
    req = next((a for a in actions if a["kind"] == "request"), None)
    assert req is not None
    assert req["title"] == "Kid A"


def test_overview_period_widens_window(admin_client, school):
    route, bus = make_route(school)
    make_trip(school, route, bus, actual_arrival=time(7, 30))  # today
    first = timezone.localdate().replace(day=1)
    make_trip(school, route, bus, service_date=first, actual_arrival=time(7, 30))  # 1st of month

    today_total = sum(s["value"] for s in admin_client.get(OVERVIEW).data["trip_segments"])
    month_total = sum(
        s["value"] for s in admin_client.get(f"{OVERVIEW}?period=month").data["trip_segments"]
    )
    assert month_total >= today_total


def test_overview_includes_school_coords(admin_client, school):
    school.latitude, school.longitude = 30.0074, 31.4913
    school.save(update_fields=["latitude", "longitude"])
    route, bus = make_route(school)
    make_trip(school, route, bus)
    data = admin_client.get(OVERVIEW).data
    assert data["school"] == {"latitude": 30.0074, "longitude": 31.4913}


def test_live_is_school_scoped(admin_client, school, other_school):
    r1, b1 = make_route(school, code="R-01")
    r2, b2 = make_route(other_school, code="R-02")
    make_trip(school, r1, b1)
    make_trip(other_school, r2, b2)
    assert len(admin_client.get(LIVE).data) == 1


def test_live_requires_admin(parent_user):
    client = APIClient()
    client.force_authenticate(parent_user)
    assert client.get(LIVE).status_code == 403
