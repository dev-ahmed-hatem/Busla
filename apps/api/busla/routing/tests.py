"""Routing: optimizer, generate_routes service, and the routes API."""

from __future__ import annotations

from rest_framework.test import APIClient

from busla.fleet.models import Bus
from busla.people.models import Driver, Student, Supervisor
from busla.routing.models import Route
from busla.routing.optimizers import GreedyOptimizer, Stop, haversine_km
from busla.routing.services import generate_routes

ROUTES = "/api/v1/routes/"


def _students(school, n, *, base=(30.0, 31.0)):
    return [
        Student.objects.create(
            school=school, full_name=f"S{i}", status="scheduled",
            latitude=base[0] + i * 0.01, longitude=base[1],
        )
        for i in range(n)
    ]


def test_haversine_and_greedy():
    assert haversine_km((30.0, 31.0), (30.0, 31.0)) == 0
    assert haversine_km((30.0, 31.0), (30.1, 31.0)) > 0
    stops = [Stop(str(i), 30.0 + i * 0.01, 31.0) for i in range(5)]
    routes = GreedyOptimizer().plan(stops, (30.0, 31.0), num_vehicles=2, capacity=3)
    assigned = sum(len(r.stop_keys) for r in routes)
    assert assigned == 5
    assert all(len(r.stop_keys) <= 3 for r in routes[:-1])


def test_generate_routes_respects_capacity_and_links_students(db, school):
    school.latitude, school.longitude = 30.0, 31.0
    school.save(update_fields=["latitude", "longitude"])
    Bus.objects.create(school=school, bus_number="B1", capacity=2, status="in_service")
    Bus.objects.create(school=school, bus_number="B2", capacity=2, status="in_service")
    _students(school, 3)

    routes = generate_routes(school, num_buses=2, seats_per_bus=2)

    assert len(routes) >= 1
    assert sum(r.students.count() for r in routes) == 3
    assert all(r.students.count() <= 2 for r in routes)
    assert all(r.stops.count() >= 1 for r in routes)
    assert Student.objects.filter(school=school, route__isnull=False).count() == 3


def test_optimize_endpoint_creates_routes(admin_client, school):
    school.latitude, school.longitude = 30.0, 31.0
    school.save(update_fields=["latitude", "longitude"])
    Bus.objects.create(school=school, bus_number="B1", capacity=25, status="in_service")
    _students(school, 3)

    resp = admin_client.post(ROUTES + "optimize/", {"num_buses": 1, "seats_per_bus": 25}, format="json")
    assert resp.status_code == 201
    assert len(resp.data) >= 1
    assert admin_client.get(ROUTES).data["count"] >= 1


def test_readiness_counts_students_with_coords(admin_client, school):
    _students(school, 2)
    Student.objects.create(school=school, full_name="NoCoords", status="scheduled")
    resp = admin_client.get(ROUTES + "readiness/")
    assert resp.status_code == 200
    assert resp.data["students_ready"] == 2


def test_optimize_requires_admin(parent_user):
    client = APIClient()
    client.force_authenticate(parent_user)
    assert client.post(ROUTES + "optimize/", {"num_buses": 1, "seats_per_bus": 25}, format="json").status_code == 403


def test_routes_are_school_scoped(admin_client, school, other_school):
    Route.objects.create(school=school, code="R-01")
    Route.objects.create(school=other_school, code="R-01")
    assert admin_client.get(ROUTES).data["count"] == 1


def test_assigning_driver_flips_status_to_ready(admin_client, school):
    bus = Bus.objects.create(school=school, bus_number="B1", capacity=25, status="in_service")
    sup = Supervisor.objects.create(school=school, full_name="Sup", status="active")
    route = Route.objects.create(school=school, code="R-01", bus=bus, supervisor=sup)
    Student.objects.create(school=school, full_name="S", status="scheduled", route=route)
    driver = Driver.objects.create(school=school, full_name="Drv", status="active")

    resp = admin_client.patch(f"{ROUTES}{route.id}/", {"driver": str(driver.id)}, format="json")
    assert resp.status_code == 200
    route.refresh_from_db()
    assert route.status == "ready"
