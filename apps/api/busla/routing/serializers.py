from __future__ import annotations

from rest_framework import serializers

from .models import Route, RouteStop, Shift


class RouteStopSerializer(serializers.ModelSerializer):
    student_name = serializers.SerializerMethodField()

    class Meta:
        model = RouteStop
        fields = ["id", "sequence", "kind", "student", "student_name", "label", "latitude", "longitude", "eta"]
        read_only_fields = fields

    def get_student_name(self, obj: RouteStop) -> str | None:
        return obj.student.full_name if obj.student_id else None


class RouteSerializer(serializers.ModelSerializer):
    bus_number = serializers.SerializerMethodField()
    driver_name = serializers.SerializerMethodField()
    supervisor_name = serializers.SerializerMethodField()
    student_count = serializers.SerializerMethodField()
    capacity = serializers.SerializerMethodField()
    stops = RouteStopSerializer(many=True, read_only=True)

    class Meta:
        model = Route
        fields = [
            "id", "code", "name", "shift", "area",
            "bus", "bus_number", "driver", "driver_name", "supervisor", "supervisor_name",
            "status", "distance_km", "duration_min", "student_count", "capacity", "stops",
            "created_at", "updated_at",
        ]
        read_only_fields = [
            "id", "bus_number", "driver_name", "supervisor_name", "status",
            "distance_km", "duration_min", "student_count", "capacity", "stops",
            "created_at", "updated_at",
        ]

    def get_bus_number(self, obj: Route) -> str | None:
        return obj.bus.bus_number if obj.bus_id else None

    def get_driver_name(self, obj: Route) -> str | None:
        return obj.driver.full_name if obj.driver_id else None

    def get_supervisor_name(self, obj: Route) -> str | None:
        return obj.supervisor.full_name if obj.supervisor_id else None

    def get_student_count(self, obj: Route) -> int:
        return obj.students.filter(is_deleted=False).count()

    def get_capacity(self, obj: Route) -> int | None:
        return obj.bus.capacity if obj.bus_id else None


class OptimizeParamsSerializer(serializers.Serializer):
    num_buses = serializers.IntegerField(min_value=1)
    seats_per_bus = serializers.IntegerField(min_value=1)
    shift = serializers.ChoiceField(choices=Shift.choices, default=Shift.MORNING)
    # Accepted for forward-compatibility; not yet used by the haversine optimizer.
    arrival_deadline = serializers.TimeField(required=False, allow_null=True)
    multi_shift = serializers.BooleanField(default=False)
