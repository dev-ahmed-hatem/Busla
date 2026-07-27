from __future__ import annotations

from rest_framework import serializers

from .models import DriverCheckIn, Notification
from .utils import group_of, humanize_time


class NotificationSerializer(serializers.ModelSerializer):
    time = serializers.SerializerMethodField()
    group = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = ["id", "kind", "title", "subtitle", "is_read", "time", "group"]

    def get_time(self, obj: Notification) -> str:
        return humanize_time(obj.occurred_at)

    def get_group(self, obj: Notification) -> str:
        return group_of(obj.occurred_at)


class CheckInSerializer(serializers.Serializer):
    id = serializers.UUIDField()
    name = serializers.SerializerMethodField()
    bus = serializers.SerializerMethodField()
    state = serializers.CharField()
    detail = serializers.SerializerMethodField()

    def get_name(self, o: DriverCheckIn) -> str:
        return o.driver.full_name

    def get_bus(self, o: DriverCheckIn) -> str:
        return o.driver.bus.bus_number if o.driver.bus_id else "—"

    def get_detail(self, o: DriverCheckIn) -> str:
        if o.state == DriverCheckIn.State.CHECKED_IN:
            return f"Checked in {o.checked_in_at.strftime('%H:%M')}" if o.checked_in_at else "Checked in"
        if o.state == DriverCheckIn.State.PENDING:
            return f"Pending - {o.pending_minutes} min"
        return "No response"
