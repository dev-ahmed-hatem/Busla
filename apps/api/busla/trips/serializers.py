"""Trip serializers. Output shapes deliberately match the already-built web UI
(apps/web/src/lib/mock/live-tracking.ts) so the components drop in unchanged."""

from __future__ import annotations

from datetime import time

from rest_framework import serializers

from .models import Trip


def _fmt12(t: time | None) -> str:
    return t.strftime("%I:%M %p") if t else ""


def _fmt24(t: time | None) -> str:
    return t.strftime("%H:%M") if t else ""


def _occupied(trip: Trip) -> int:
    return trip.route.students.filter(is_deleted=False).count() if trip.route_id else 0


class LiveJourneySerializer(serializers.Serializer):
    """Active journey for the live map/panel."""

    id = serializers.UUIDField()
    bus = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()
    headingLabel = serializers.SerializerMethodField()
    destination = serializers.SerializerMethodField()
    occupied = serializers.SerializerMethodField()
    capacity = serializers.SerializerMethodField()
    minutes = serializers.SerializerMethodField()
    kmDone = serializers.SerializerMethodField()
    kmTotal = serializers.SerializerMethodField()
    driver = serializers.SerializerMethodField()
    nanny = serializers.SerializerMethodField()
    latitude = serializers.FloatField(source="current_lat")
    longitude = serializers.FloatField(source="current_lng")

    def get_bus(self, t: Trip) -> str:
        return t.bus.bus_number if t.bus_id else "—"

    def get_status(self, t: Trip) -> str:
        return t.get_status_display()  # "On-time" / "Delayed" / "Broken down" / "Off-route"

    def get_headingLabel(self, t: Trip) -> str:
        return "Stopped at" if t.status == Trip.Status.BROKEN_DOWN else "Heading to"

    def get_destination(self, t: Trip) -> str:
        stop = t.next_stop()
        if stop:
            return stop.label
        return t.route.name if t.route_id else "School"

    def get_occupied(self, t: Trip) -> int:
        return _occupied(t)

    def get_capacity(self, t: Trip) -> int:
        return t.bus.capacity if t.bus_id else 0

    def get_minutes(self, t: Trip) -> int:
        if not t.route_id:
            return 0
        return round(t.route.duration_min * (1 - t.progress_fraction()))

    def get_kmDone(self, t: Trip) -> float:
        return round(t.route.distance_km * t.progress_fraction(), 1) if t.route_id else 0

    def get_kmTotal(self, t: Trip) -> float:
        return t.route.distance_km if t.route_id else 0

    def get_driver(self, t: Trip) -> str:
        return t.driver.full_name if t.driver_id else ""

    def get_nanny(self, t: Trip) -> str:
        return t.supervisor.full_name if t.supervisor_id else ""


class TripDetailSerializer(LiveJourneySerializer):
    """Live-journey fields + route timeline for the bus-detail panel."""

    fromLabel = serializers.SerializerMethodField(method_name="get_from")
    to = serializers.SerializerMethodField()
    departure = serializers.SerializerMethodField()
    stops = serializers.SerializerMethodField()
    arrival = serializers.SerializerMethodField()
    timeline = serializers.SerializerMethodField()

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["from"] = data.pop("fromLabel")
        return data

    def get_from(self, t: Trip) -> str:
        stops = t.ordered_stops
        return stops[0].label if stops else (t.route.area if t.route_id else "")

    def get_to(self, t: Trip) -> str:
        stops = t.ordered_stops
        return stops[-1].label if stops else "School"

    def get_departure(self, t: Trip) -> str:
        return _fmt12(t.scheduled_departure)

    def get_arrival(self, t: Trip) -> str:
        return _fmt12(t.scheduled_arrival)

    def get_stops(self, t: Trip) -> int:
        return len(t.ordered_stops)

    def get_timeline(self, t: Trip) -> list[dict]:
        out = []
        for i, stop in enumerate(t.ordered_stops):
            if i < t.current_stop_index:
                status = "completed"
            elif i == t.current_stop_index:
                status = "current"
            else:
                status = "upcoming"
            out.append(
                {
                    "status": status,
                    "title": stop.label,
                    "address": stop.get_kind_display(),
                    "time": _fmt12(stop.eta),
                }
            )
        return out


class JourneyLogSerializer(serializers.Serializer):
    """Historical (finished) trip row for the Journey Logs table."""

    id = serializers.SerializerMethodField()
    bus = serializers.SerializerMethodField()
    driver = serializers.SerializerMethodField()
    nanny = serializers.SerializerMethodField()
    shift = serializers.SerializerMethodField()
    depSched = serializers.SerializerMethodField()
    depActual = serializers.SerializerMethodField()
    arrSched = serializers.SerializerMethodField()
    arrActual = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()
    statusLabel = serializers.SerializerMethodField()

    def get_id(self, t: Trip) -> str:
        return f"#{str(t.id).split('-')[0][:6].upper()}"

    def get_bus(self, t: Trip) -> str:
        return t.bus.bus_number if t.bus_id else "—"

    def get_driver(self, t: Trip) -> str:
        return t.driver.full_name if t.driver_id else "—"

    def get_nanny(self, t: Trip) -> str:
        return t.supervisor.full_name if t.supervisor_id else "—"

    def get_shift(self, t: Trip) -> str:
        return t.get_shift_display()

    def get_depSched(self, t: Trip) -> str:
        return _fmt24(t.scheduled_departure)

    def get_depActual(self, t: Trip) -> str:
        return _fmt24(t.actual_departure)

    def get_arrSched(self, t: Trip) -> str:
        return _fmt24(t.scheduled_arrival)

    def get_arrActual(self, t: Trip) -> str:
        if t.status == Trip.Status.BROKEN_DOWN:
            return f"Terminated {_fmt24(t.actual_arrival)}".strip()
        return _fmt24(t.actual_arrival)

    def get_status(self, t: Trip) -> str:
        return t.get_status_display()

    def get_statusLabel(self, t: Trip) -> str:
        if t.status == Trip.Status.DELAYED:
            return f"Delayed {t.delay_minutes}m"
        return t.get_status_display()


class TripPositionSerializer(serializers.Serializer):
    latitude = serializers.FloatField()
    longitude = serializers.FloatField()
    heading = serializers.FloatField(required=False)
