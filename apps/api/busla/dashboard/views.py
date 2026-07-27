"""Dashboard aggregate stats — KPI counts + bus capacity, scoped to the admin's school.

Derived entirely from Phase-2 data (fleet + people). Trip-based widgets (status donut,
action-required, live map) come later with Phase 4.
"""

from __future__ import annotations

from django.db.models import Count, Q
from drf_spectacular.utils import extend_schema
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from busla.common.permissions import IsAdmin
from busla.fleet.models import Bus
from busla.people.models import Driver, Student, Supervisor

from .serializers import DashboardStatsSerializer


def _pct(part: int, total: int) -> float:
    return round(part / total * 100, 1) if total else 0.0


def _kpi(total: int, active: int) -> dict:
    return {"total": total, "active": active, "inactive": total - active, "utilization": _pct(active, total)}


class DashboardStatsView(APIView):
    permission_classes = [IsAdmin]

    @extend_schema(responses=DashboardStatsSerializer, operation_id="dashboard_stats")
    def get(self, request: Request) -> Response:
        school_id = request.user.school_id
        scope = {"school_id": school_id, "is_deleted": False}

        buses = Bus.objects.filter(**scope)
        drivers = Driver.objects.filter(**scope)
        supervisors = Supervisor.objects.filter(**scope)
        students = Student.objects.filter(**scope)

        data = {
            "buses": _kpi(buses.count(), buses.filter(status="in_service").count()),
            "drivers": _kpi(drivers.count(), drivers.filter(status="active").count()),
            "supervisors": _kpi(supervisors.count(), supervisors.filter(status="active").count()),
            "students": _kpi(students.count(), students.filter(status="scheduled").count()),
            "bus_capacity": [
                {
                    "bus": b.bus_number,
                    "route": b.model_name or None,
                    "capacity": b.capacity,
                    "occupied": b.occupied,
                    "available": max(0, b.capacity - b.occupied),
                }
                for b in buses.annotate(
                    occupied=Count("students", filter=Q(students__is_deleted=False))
                )
            ],
        }
        return Response(DashboardStatsSerializer(data).data)
