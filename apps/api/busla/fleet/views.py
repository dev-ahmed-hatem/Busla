from __future__ import annotations

from busla.common.viewsets import SchoolScopedModelViewSet

from .models import Bus
from .serializers import BusSerializer


class BusViewSet(SchoolScopedModelViewSet):
    """CRUD for buses, scoped to the admin's school."""

    queryset = Bus.objects.all()
    serializer_class = BusSerializer
    filterset_fields = ["status"]
    search_fields = ["bus_number", "license_plate", "model_name"]
    ordering_fields = ["bus_number", "status", "last_maintenance_at", "odometer_km"]
