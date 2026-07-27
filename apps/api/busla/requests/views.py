from __future__ import annotations

from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.response import Response

from busla.common.permissions import IsAdmin, IsParent
from busla.common.viewsets import SchoolScopedModelViewSet
from busla.notifications.models import Notification
from busla.notifications.services import notify

from .models import ParentRequest
from .serializers import (
    ParentRequestDetailSerializer,
    ParentRequestListSerializer,
    ParentRequestWriteSerializer,
)
from .services import suggest_bus


class ParentRequestViewSet(SchoolScopedModelViewSet):
    queryset = ParentRequest.objects.all().select_related("student", "student__bus", "student__route")
    filterset_fields = ["status", "student"]
    search_fields = ["student__full_name"]

    def get_permissions(self):
        # Parents (their app) submit requests; admins review/approve.
        if self.action == "create":
            return [(IsAdmin | IsParent)()]
        return [IsAdmin()]

    def get_serializer_class(self):
        if self.action == "create":
            return ParentRequestWriteSerializer
        if self.action == "retrieve":
            return ParentRequestDetailSerializer
        return ParentRequestListSerializer

    @action(detail=True, methods=["post"])
    def approve(self, request: Request, pk=None) -> Response:
        req = self.get_object()
        student = req.student
        if req.requested_address:
            student.address = req.requested_address
        if req.requested_area:
            student.area = req.requested_area
        result = suggest_bus(req.school)
        if result:
            bus = result[0]
            student.bus = bus
            student.route = bus.routes.filter(is_deleted=False).first()
        student.save()

        req.status = ParentRequest.Status.APPROVED
        req.save(update_fields=["status", "updated_at"])
        notify(
            req.school,
            Notification.Kind.PARENT_REQUEST,
            f"Request approved – {student.full_name}",
            "Pickup change applied.",
            student=student,
        )
        return Response(ParentRequestDetailSerializer(req).data)

    @action(detail=True, methods=["post"])
    def reject(self, request: Request, pk=None) -> Response:
        req = self.get_object()
        req.status = ParentRequest.Status.REJECTED
        req.save(update_fields=["status", "updated_at"])
        return Response(ParentRequestDetailSerializer(req).data)
