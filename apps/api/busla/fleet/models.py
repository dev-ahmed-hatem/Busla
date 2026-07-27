"""Fleet: buses and their operational status."""

from __future__ import annotations

from django.db import models

from busla.common.models import TenantScopedModel


class Bus(TenantScopedModel):
    class Status(models.TextChoices):
        IN_SERVICE = "in_service", "In Service"
        MAINTENANCE = "maintenance", "Maintenance"
        ISSUE = "issue", "Issue"

    bus_number = models.CharField(max_length=32)
    license_plate = models.CharField(max_length=32, blank=True)
    model_name = models.CharField(max_length=120, blank=True)
    capacity = models.PositiveIntegerField(default=25)
    odometer_km = models.PositiveIntegerField(default=0)
    status = models.CharField(max_length=16, choices=Status.choices, default=Status.IN_SERVICE)
    breakdown_reason = models.CharField(max_length=120, blank=True)
    last_maintenance_at = models.DateField(null=True, blank=True)
    photo = models.ImageField(upload_to="buses/", null=True, blank=True)

    class Meta:
        ordering = ["bus_number"]
        constraints = [
            models.UniqueConstraint(fields=["school", "bus_number"], name="uniq_bus_number_per_school"),
        ]

    def __str__(self) -> str:
        return self.bus_number
