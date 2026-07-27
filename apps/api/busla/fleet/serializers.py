from __future__ import annotations

from rest_framework import serializers

from .models import Bus


class BusSerializer(serializers.ModelSerializer):
    driver_name = serializers.SerializerMethodField()

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
            "driver_name",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "driver_name", "created_at", "updated_at"]

    def get_driver_name(self, obj: Bus) -> str | None:
        drivers = getattr(obj, "drivers", None)
        driver = drivers.first() if drivers is not None else None
        return driver.full_name if driver else None
