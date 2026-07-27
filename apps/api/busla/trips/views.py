from __future__ import annotations

from datetime import timedelta

from django.utils import timezone
from drf_spectacular.utils import extend_schema
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from busla.common.permissions import IsAdmin
from busla.people.models import Driver
from busla.requests.models import ParentRequest
from busla.routing.optimizers import haversine_km

from .models import Trip
from .serializers import (
    JourneyLogSerializer,
    LiveJourneySerializer,
    TripDetailSerializer,
    TripPositionSerializer,
)


def _scope(request):
    return getattr(request.user, "school_id", None)


class TripViewSet(viewsets.ReadOnlyModelViewSet):
    """Read + lifecycle actions for trips. Trips are created by optimize/generate, not
    direct POST, so this is read-only with explicit POST actions."""

    serializer_class = TripDetailSerializer
    filterset_fields = ["shift", "status", "service_date"]
    search_fields = ["bus__bus_number", "driver__full_name", "route__code"]
    ordering_fields = ["service_date", "status"]

    def get_permissions(self):
        # The driver's phone pushes GPS; admins do everything else.
        if self.action == "position":
            from busla.common.permissions import IsDriverOrSupervisor

            return [(IsAdmin | IsDriverOrSupervisor)()]
        return [IsAdmin()]

    def get_queryset(self):
        school_id = _scope(self.request)
        if not school_id:
            return Trip.objects.none()
        return (
            Trip.objects.filter(school_id=school_id, is_deleted=False)
            .select_related("route", "bus", "driver", "supervisor")
            .prefetch_related("route__stops")
        )

    @extend_schema(responses=LiveJourneySerializer(many=True))
    @action(detail=False)
    def live(self, request: Request) -> Response:
        qs = self.get_queryset().filter(status__in=Trip.ACTIVE_STATUSES, actual_arrival__isnull=True)
        return Response(LiveJourneySerializer(qs, many=True).data)

    @extend_schema(responses=JourneyLogSerializer(many=True))
    @action(detail=False)
    def logs(self, request: Request) -> Response:
        qs = self.filter_queryset(self.get_queryset().filter(actual_arrival__isnull=False))
        page = self.paginate_queryset(qs)
        if page is not None:
            return self.get_paginated_response(JourneyLogSerializer(page, many=True).data)
        return Response(JourneyLogSerializer(qs, many=True).data)

    @action(detail=False, url_path="logs-summary")
    def logs_summary(self, request: Request) -> Response:
        today = timezone.localdate()
        qs = self.get_queryset().filter(service_date=today)
        total = qs.count()
        completed = qs.filter(actual_arrival__isnull=False).count()
        ontime = qs.filter(status=Trip.Status.ON_TIME).count()
        delayed = qs.filter(status=Trip.Status.DELAYED).count()
        incidents = qs.filter(status__in=[Trip.Status.BROKEN_DOWN, Trip.Status.OFF_ROUTE]).count()

        def spark(n: int) -> list[int]:
            return [round(n * f) for f in (0.2, 0.4, 0.5, 0.7, 0.6, 0.85, 1.0)]

        pct = lambda part: f"{round(part / total * 100)}% of total trips" if total else "—"  # noqa: E731
        return Response(
            [
                {"key": "completed", "title": "Completed Trips", "value": completed, "sub": pct(completed), "tone": "onTime", "spark": spark(completed)},
                {"key": "ontime", "title": "On time Trips", "value": ontime, "sub": pct(ontime), "tone": "onTime", "spark": spark(ontime)},
                {"key": "delayed", "title": "Delayed Trips", "value": delayed, "sub": "Avg. delay time +15m", "tone": "delayed", "spark": spark(delayed)},
                {"key": "incidents", "title": "Incidents", "value": incidents, "sub": "Requires attention", "tone": "issue", "spark": spark(incidents)},
            ]
        )

    @extend_schema(request=TripPositionSerializer, responses=LiveJourneySerializer)
    @action(detail=True, methods=["post"])
    def position(self, request: Request, pk=None) -> Response:
        trip = self.get_object()
        data = TripPositionSerializer(data=request.data)
        data.is_valid(raise_exception=True)
        lat, lng = data.validated_data["latitude"], data.validated_data["longitude"]
        trip.current_lat, trip.current_lng, trip.last_ping_at = lat, lng, timezone.now()
        stops = trip.ordered_stops
        if stops:
            nearest = min(
                range(len(stops)),
                key=lambda i: haversine_km((lat, lng), (stops[i].latitude or lat, stops[i].longitude or lng)),
            )
            trip.current_stop_index = nearest
        trip.save(update_fields=["current_lat", "current_lng", "last_ping_at", "current_stop_index", "updated_at"])
        return Response(LiveJourneySerializer(trip).data)


def _period_start(period: str, today):
    """Inclusive start date for a status-donut period; end is always `today`."""
    if period == "week":
        return today - timedelta(days=today.weekday())  # Monday of this week
    if period == "month":
        return today.replace(day=1)
    return today  # default: today only


class TripsOverviewView(APIView):
    """Dashboard trip widgets: status donut (period-scoped), action-required + live map
    pins (always today/now)."""

    permission_classes = [IsAdmin]

    def get(self, request: Request) -> Response:
        school_id = _scope(request)
        today = timezone.localdate()

        # Donut segments follow the selected period; map + actions stay "today/now".
        period = request.query_params.get("period", "today")
        seg_base = Trip.objects.filter(
            school_id=school_id, is_deleted=False,
            service_date__gte=_period_start(period, today), service_date__lte=today,
        )
        active = (
            Trip.objects.filter(
                school_id=school_id, is_deleted=False, service_date=today,
                status__in=Trip.ACTIVE_STATUSES, actual_arrival__isnull=True,
            )
            .select_related("route", "bus")
        )

        # Mutually-exclusive partition: completed, then by status among the not-yet-arrived.
        total = seg_base.count()
        completed = seg_base.filter(actual_arrival__isnull=False).count()
        pending = seg_base.filter(actual_arrival__isnull=True)
        in_progress = pending.filter(status=Trip.Status.ON_TIME).count()
        delayed = pending.filter(status=Trip.Status.DELAYED).count()
        issues = pending.filter(status__in=[Trip.Status.BROKEN_DOWN, Trip.Status.OFF_ROUTE]).count()

        def seg(key, label, value, tone):
            return {"key": key, "label": label, "value": value, "percent": round(value / total * 100, 1) if total else 0, "tone": tone}

        segments = [
            seg("completed", "Completed", completed, "onTime"),
            seg("in_progress", "In progress", in_progress, "info"),
            seg("delayed", "Delayed", delayed, "delayed"),
            seg("issues", "Issues", issues, "issue"),
        ]

        actions = []
        now = timezone.now()
        for trip in active:
            bus = trip.bus.bus_number if trip.bus_id else "Bus"
            mins = round((now - trip.last_ping_at).total_seconds() / 60) if trip.last_ping_at else 0
            if trip.status == Trip.Status.BROKEN_DOWN:
                actions.append({"id": str(trip.id), "kind": "breakdown", "title": f"{bus} – Breakdown", "subtitle": "Trip is currently stopped", "minsAgo": mins})
            elif trip.status == Trip.Status.OFF_ROUTE:
                actions.append({"id": str(trip.id), "kind": "off_route", "title": f"{bus} – Off Route", "subtitle": "Bus is off the planned route", "minsAgo": mins})
            elif trip.status == Trip.Status.DELAYED:
                actions.append({"id": str(trip.id), "kind": "delayed", "title": f"{bus} – Delayed", "subtitle": f"Delayed by {trip.delay_minutes} minutes", "minsAgo": mins})

        for driver in Driver.objects.filter(school_id=school_id, is_deleted=False, status="absent")[:3]:
            actions.append({"id": str(driver.id), "kind": "absent", "title": f"Driver {driver.full_name} – Absent", "subtitle": "Not available for today's shift", "minsAgo": 0})

        # Pending parent pickup-change requests (Phase 5) surface as action items too.
        pending_requests = (
            ParentRequest.objects.filter(
                school_id=school_id, is_deleted=False, status=ParentRequest.Status.PENDING
            )
            .select_related("student")
            .order_by("-occurred_at")[:3]
        )
        for req in pending_requests:
            mins = round((now - req.occurred_at).total_seconds() / 60) if req.occurred_at else 0
            actions.append({
                "id": str(req.id), "kind": "request",
                "title": req.student.full_name if req.student_id else "Parent Request",
                "subtitle": req.reason or "Pickup change requested",
                "minsAgo": max(0, mins),
            })

        pins = [
            {"bus": t.bus.bus_number if t.bus_id else "Bus", "status": t.get_status_display(), "latitude": t.current_lat, "longitude": t.current_lng}
            for t in active
            if t.current_lat is not None and t.current_lng is not None
        ]

        school = getattr(request.user, "school", None)
        school_pin = (
            {"latitude": school.latitude, "longitude": school.longitude} if school else None
        )

        return Response({
            "trip_segments": segments,
            "action_required": actions,
            "map_pins": pins,
            "school": school_pin,
        })
