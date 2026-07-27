"""Trips API: live journeys, detail timeline, logs, position ingest, overview."""

from __future__ import annotations

from datetime import time, timedelta

from django.utils import timezone
from rest_framework.test import APIClient

from busla.fleet.models import Bus
from busla.people.models import Student
from busla.routing.models import Route, RouteStop
from busla.trips.models import Trip

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
