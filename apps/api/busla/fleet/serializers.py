from __future__ import annotations

from rest_framework import serializers

from .models import Bus


class BusSerializer(serializers.ModelSerializer):
    driver_name = serializers.SerializerMethodField()
    route_name = serializers.SerializerMethodField()

    class Meta:
        model = Bus
        fields = [
            "id",
            "bus_number",
            "license_plate",
            "model_name",
            "capacity",
            "odometer_km",
            "status",
            "breakdown_reason",
            "last_maintenance_at",
            "photo",
            "driver_name",
            "route_name",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "driver_name", "route_name", "created_at", "updated_at"]

    def get_driver_name(self, obj: Bus) -> str | None:
        drivers = getattr(obj, "drivers", None)
        driver = drivers.first() if drivers is not None else None
        return driver.full_name if driver else None

    def get_route_name(self, obj: Bus) -> str | None:
        routes = getattr(obj, "routes", None)
        route = routes.filter(is_deleted=False).first() if routes is not None else None
        return route.name if route else None
