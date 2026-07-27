from __future__ import annotations

from django.utils import timezone
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.response import Response

from busla.common.permissions import IsAdmin, IsDriverOrSupervisor
from busla.people.models import Driver

from .models import DriverCheckIn, Notification
from .serializers import CheckInSerializer, NotificationSerializer
from .services import notify


def _school(request):
    return getattr(request.user, "school_id", None)


class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [IsAdmin]

    def get_queryset(self):
        sid = _school(self.request)
        if not sid:
            return Notification.objects.none()
        return Notification.objects.filter(school_id=sid, is_deleted=False)

    def list(self, request: Request, *args, **kwargs) -> Response:
        qs = self.get_queryset()[:50]
        return Response(NotificationSerializer(qs, many=True).data)

    @action(detail=False, url_path="unread-count")
    def unread_count(self, request: Request) -> Response:
        return Response({"count": self.get_queryset().filter(is_read=False).count()})

    @action(detail=False, methods=["post"], url_path="read-all")
    def read_all(self, request: Request) -> Response:
        self.get_queryset().filter(is_read=False).update(is_read=True)
        return Response({"ok": True})

    @action(detail=True, methods=["post"])
    def read(self, request: Request, pk=None) -> Response:
        obj = self.get_object()
        obj.is_read = True
        obj.save(update_fields=["is_read", "updated_at"])
        return Response(NotificationSerializer(obj).data)


class ShiftReadinessViewSet(viewsets.ViewSet):
    def get_permissions(self):
        if self.action == "checkin":
            return [(IsAdmin | IsDriverOrSupervisor)()]
        return [IsAdmin()]

    def _today_qs(self, request):
        sid = _school(request)
        if not sid:
            return DriverCheckIn.objects.none()
        return DriverCheckIn.objects.filter(
            school_id=sid, is_deleted=False, service_date=timezone.localdate()
        ).select_related("driver", "driver__bus")

    def list(self, request: Request) -> Response:
        qs = self._today_qs(request)
        checked = qs.filter(state=DriverCheckIn.State.CHECKED_IN).count()
        return Response(
            {
                "summary": {"time": "04:00 AM", "checkedIn": checked, "total": qs.count()},
                "checkins": CheckInSerializer(qs, many=True).data,
            }
        )

    @action(detail=False)
    def substitutes(self, request: Request) -> Response:
        sid = _school(request)
        drivers = Driver.objects.filter(school_id=sid, is_deleted=False, status="active")
        return Response(
            [{"id": str(d.id), "name": d.full_name, "bus": d.bus.bus_number if d.bus_id else None} for d in drivers]
        )

    @action(detail=True, methods=["post"])
    def remind(self, request: Request, pk=None) -> Response:
        ci = self._today_qs(request).filter(pk=pk).first()
        if not ci:
            return Response(status=404)
        notify(
            ci.school,
            Notification.Kind.REMINDER,
            f"Reminder sent to {ci.driver.full_name}",
            "Please check in for your shift.",
        )
        return Response({"ok": True})

    @action(detail=False, methods=["post"])
    def checkin(self, request: Request) -> Response:
        """Driver's-app check-in ingest."""
        sid = _school(request)
        driver_id = request.data.get("driver")
        shift = request.data.get("shift", "morning")
        driver = Driver.objects.filter(school_id=sid, pk=driver_id).first()
        if not driver:
            return Response({"detail": "Unknown driver"}, status=400)
        ci, _ = DriverCheckIn.objects.update_or_create(
            school=driver.school, driver=driver, service_date=timezone.localdate(), shift=shift,
            defaults={"state": DriverCheckIn.State.CHECKED_IN, "checked_in_at": timezone.localtime().time()},
        )
        return Response(CheckInSerializer(ci).data)
