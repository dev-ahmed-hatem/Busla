from __future__ import annotations

from rest_framework import serializers

from busla.notifications.utils import group_of, humanize_time

from .models import ParentRequest
from .services import suggest_bus


def _zone(req: ParentRequest) -> str:
    area = req.student.area
    if not req.requested_area or req.requested_area == area:
        return "Same zone"
    return f"{area} → {req.requested_area}"


class ParentRequestListSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    zone = serializers.SerializerMethodField()
    time = serializers.SerializerMethodField()
    group = serializers.SerializerMethodField()

    class Meta:
        model = ParentRequest
        fields = ["id", "name", "zone", "reason", "time", "group", "is_read", "status"]

    def get_name(self, o):
        return o.student.full_name

    def get_zone(self, o):
        return _zone(o)

    def get_time(self, o):
        return humanize_time(o.occurred_at)

    def get_group(self, o):
        return group_of(o.occurred_at)


class ParentRequestDetailSerializer(serializers.ModelSerializer):
    date = serializers.SerializerMethodField()
    current = serializers.SerializerMethodField()
    requested = serializers.SerializerMethodField()
    suggestion = serializers.SerializerMethodField()

    class Meta:
        model = ParentRequest
        fields = ["id", "date", "current", "requested", "suggestion", "status"]

    def get_date(self, o):
        dt = o.occurred_at
        return f"{dt.strftime('%A, %B')} {dt.day}, {dt.year}"

    def get_current(self, o):
        s = o.student
        route = ""
        if s.bus_id and s.route_id:
            route = f"{s.bus.bus_number} - {s.route.name}"
        elif s.route_id:
            route = s.route.name
        return {"address": s.address or "—", "route": route or "—", "tag": _zone(o)}

    def get_requested(self, o):
        label = "Pending Assignment" if o.status == ParentRequest.Status.PENDING else o.get_status_display()
        return {"address": o.requested_address or "—", "status": label}

    def get_suggestion(self, o):
        result = suggest_bus(o.school)
        if not result:
            return {"text": "No available bus to suggest.", "bus": "—", "seatsLeft": 0, "percent": 0}
        bus, seats_left, percent = result
        return {
            "text": f"Based on the new address, we suggest switching to {bus.bus_number} to minimize travel time.",
            "bus": bus.bus_number,
            "seatsLeft": seats_left,
            "percent": percent,
        }


class ParentRequestWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ParentRequest
        fields = ["id", "student", "requested_address", "requested_area", "reason"]
        read_only_fields = ["id"]
