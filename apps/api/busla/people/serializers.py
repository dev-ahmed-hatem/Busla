from __future__ import annotations

from rest_framework import serializers

from .models import Driver, Guardian, Student, Supervisor


class _BusNameMixin(serializers.Serializer):
    bus_number = serializers.SerializerMethodField()

    def get_bus_number(self, obj) -> str | None:
        return obj.bus.bus_number if obj.bus_id else None


def _staff_route_name(obj) -> str | None:
    """Route a driver/supervisor is assigned to (Route.driver / Route.supervisor reverse)."""
    route = obj.routes.filter(is_deleted=False).first()
    return route.name if route else None


class GuardianSerializer(serializers.ModelSerializer):
    class Meta:
        model = Guardian
        fields = ["id", "student", "name", "relationship", "phone", "email", "is_primary"]
        read_only_fields = ["id"]


class StudentSerializer(_BusNameMixin, serializers.ModelSerializer):
    guardians = GuardianSerializer(many=True, read_only=True)
    route_name = serializers.SerializerMethodField()

    class Meta:
        model = Student
        fields = [
            "id",
            "full_name",
            "date_of_birth",
            "grade",
            "class_name",
            "area",
            "address",
            "phone",
            "bus",
            "bus_number",
            "route",
            "route_name",
            "status",
            "guardians",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "bus_number", "route", "route_name", "guardians", "created_at", "updated_at"]

    def get_route_name(self, obj: Student) -> str | None:
        return obj.route.name if obj.route_id else None


class DriverSerializer(_BusNameMixin, serializers.ModelSerializer):
    route_name = serializers.SerializerMethodField()

    class Meta:
        model = Driver
        fields = [
            "id",
            "full_name",
            "phone",
            "national_id",
            "license_number",
            "license_expiry",
            "experience_years",
            "area",
            "bus",
            "bus_number",
            "route_name",
            "status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "bus_number", "route_name", "created_at", "updated_at"]

    def get_route_name(self, obj: Driver) -> str | None:
        return _staff_route_name(obj)


class SupervisorSerializer(_BusNameMixin, serializers.ModelSerializer):
    route_name = serializers.SerializerMethodField()

    class Meta:
        model = Supervisor
        fields = [
            "id",
            "full_name",
            "phone",
            "national_id",
            "area",
            "address",
            "bus",
            "bus_number",
            "route_name",
            "status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "bus_number", "route_name", "created_at", "updated_at"]

    def get_route_name(self, obj: Supervisor) -> str | None:
        return _staff_route_name(obj)
