"""Dashboard stats API: aggregates counts + capacity, school-scoped, admin-only."""

from __future__ import annotations

from rest_framework.test import APIClient

from busla.fleet.models import Bus
from busla.people.models import Student

STATS = "/api/v1/dashboard/stats/"


def test_stats_aggregate_counts_and_capacity(admin_client, school):
    b1 = Bus.objects.create(school=school, bus_number="Bus 05", capacity=25, status="in_service")
    Bus.objects.create(school=school, bus_number="Bus 06", capacity=25, status="maintenance")
    Student.objects.create(school=school, full_name="A", status="scheduled", bus=b1)
    Student.objects.create(school=school, full_name="B", status="scheduled", bus=b1)
    Student.objects.create(school=school, full_name="C", status="unscheduled")

    resp = admin_client.get(STATS)
    assert resp.status_code == 200

    assert resp.data["buses"] == {"total": 2, "active": 1, "inactive": 1, "utilization": 50.0}
    assert resp.data["students"]["total"] == 3
    assert resp.data["students"]["active"] == 2  # scheduled

    cap = {row["bus"]: row for row in resp.data["bus_capacity"]}
    assert cap["Bus 05"]["occupied"] == 2
    assert cap["Bus 05"]["available"] == 23


def test_stats_is_school_scoped(admin_client, school, other_school):
    Bus.objects.create(school=school, bus_number="Mine")
    Bus.objects.create(school=other_school, bus_number="Theirs")
    resp = admin_client.get(STATS)
    assert resp.data["buses"]["total"] == 1


def test_stats_requires_admin(parent_user):
    client = APIClient()
    client.force_authenticate(parent_user)
    assert client.get(STATS).status_code == 403
