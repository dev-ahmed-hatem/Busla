"""Route generation: run the optimizer over a school's students and persist the plan."""

from __future__ import annotations

from collections import Counter

from django.db import transaction

from busla.fleet.models import Bus
from busla.people.models import Student, Supervisor
from busla.tenancy.models import School

from .models import Route, RouteStop, Shift
from .optimizers import Stop, get_optimizer

# Fallback depot if the school has no coordinates (≈ New Cairo).
DEFAULT_DEPOT = (30.0074, 31.4913)


@transaction.atomic
def generate_routes(
    school: School,
    *,
    num_buses: int,
    seats_per_bus: int,
    shift: str = Shift.MORNING,
) -> list[Route]:
    """Optimize and (re)create routes for a school. Replaces any existing routes."""
    students = list(
        Student.objects.filter(
            school=school, is_deleted=False, latitude__isnull=False, longitude__isnull=False
        )
    )
    buses = list(Bus.objects.filter(school=school, is_deleted=False, status="in_service"))[:num_buses]
    supervisors = list(
        Supervisor.objects.filter(school=school, is_deleted=False, status="active")
    )
    depot = (
        (school.latitude, school.longitude)
        if school.latitude is not None and school.longitude is not None
        else DEFAULT_DEPOT
    )

    # Clean slate (hard delete cascades stops + SET_NULLs student.route).
    Route.objects.filter(school=school).hard_delete()

    if not students:
        return []

    vehicles = max(1, num_buses or len(buses) or 1)
    optimizer = get_optimizer()
    planned = optimizer.plan(
        [Stop(str(s.id), s.latitude, s.longitude) for s in students],
        depot,
        vehicles,
        max(1, seats_per_bus),
    )

    by_id = {str(s.id): s for s in students}
    created: list[Route] = []

    for i, plan in enumerate(planned):
        route_students = [by_id[k] for k in plan.stop_keys if k in by_id]
        if not route_students:
            continue
        area = Counter(s.area for s in route_students if s.area).most_common(1)
        area_name = area[0][0] if area else ""
        bus = buses[i] if i < len(buses) else None
        supervisor = supervisors[i] if i < len(supervisors) else None

        route = Route.objects.create(
            school=school,
            code=f"R-{i + 1:02d}",
            name=f"{area_name} Route".strip() or f"Route {i + 1}",
            shift=shift,
            area=area_name,
            bus=bus,
            supervisor=supervisor,
            distance_km=plan.distance_km,
            duration_min=plan.duration_min,
        )

        seq = 1
        if supervisor and supervisor.latitude is not None:
            RouteStop.objects.create(
                route=route, sequence=seq, kind=RouteStop.Kind.SUPERVISOR_HOME,
                label=supervisor.full_name, latitude=supervisor.latitude, longitude=supervisor.longitude,
            )
            seq += 1

        for student in route_students:
            RouteStop.objects.create(
                route=route, sequence=seq, kind=RouteStop.Kind.STUDENT, student=student,
                label=student.full_name, latitude=student.latitude, longitude=student.longitude,
            )
            seq += 1
            student.route = route
            student.bus = bus
            student.save(update_fields=["route", "bus", "updated_at"])

        RouteStop.objects.create(
            route=route, sequence=seq, kind=RouteStop.Kind.SCHOOL,
            label=school.name, latitude=depot[0], longitude=depot[1],
        )

        route.recompute_status()
        route.save(update_fields=["status", "updated_at"])
        created.append(route)

    return created
