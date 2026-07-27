from __future__ import annotations

from rest_framework import viewsets

from busla.common.permissions import IsAdmin
from busla.common.viewsets import SchoolScopedModelViewSet

from .models import Driver, Guardian, Student, Supervisor
from .serializers import (
    DriverSerializer,
    GuardianSerializer,
    StudentSerializer,
    SupervisorSerializer,
)


class StudentViewSet(SchoolScopedModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    filterset_fields = ["status", "area", "bus", "grade"]
    search_fields = ["full_name", "phone"]
    ordering_fields = ["full_name", "status", "created_at"]


class DriverViewSet(SchoolScopedModelViewSet):
    queryset = Driver.objects.all()
    serializer_class = DriverSerializer
    filterset_fields = ["status", "area", "bus"]
    search_fields = ["full_name", "phone", "national_id"]
    ordering_fields = ["full_name", "status", "created_at"]


class SupervisorViewSet(SchoolScopedModelViewSet):
    queryset = Supervisor.objects.all()
    serializer_class = SupervisorSerializer
    filterset_fields = ["status", "area", "bus"]
    search_fields = ["full_name", "phone", "national_id"]
    ordering_fields = ["full_name", "status", "created_at"]


class GuardianViewSet(viewsets.ModelViewSet):
    """Guardians are scoped through their student's school."""

    permission_classes = [IsAdmin]
    serializer_class = GuardianSerializer
    queryset = Guardian.objects.all()
    filterset_fields = ["student", "is_primary", "relationship"]

    def get_queryset(self):
        school_id = getattr(self.request.user, "school_id", None)
        if not school_id:
            return Guardian.objects.none()
        return Guardian.objects.filter(student__school_id=school_id, is_deleted=False)
