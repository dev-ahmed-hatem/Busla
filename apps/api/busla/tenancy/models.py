"""Tenant root (School) + geographic Zones.

v1 operates single-school per deployment, but the schema is multi-school-ready:
every tenant-scoped row carries a `school` FK (see common.TenantScopedModel).
"""

from __future__ import annotations

from django.db import models

from busla.common.models import BaseModel, TenantScopedModel


class School(BaseModel):
    name = models.CharField(max_length=200)
    name_ar = models.CharField(max_length=200, blank=True)
    timezone = models.CharField(max_length=64, default="Africa/Cairo")
    default_arrival_deadline = models.TimeField(null=True, blank=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    logo = models.ImageField(upload_to="schools/", null=True, blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self) -> str:
        return self.name


class Zone(TenantScopedModel):
    """Residential area (New Cairo, Shorouk, Madinaty, Al-Narjis, …).

    boundary/centroid hold GeoJSON for now; they become real PostGIS geometry
    (PolygonField/PointField) when route optimization lands in Phase 3.
    """

    name = models.CharField(max_length=120)
    name_ar = models.CharField(max_length=120, blank=True)
    boundary = models.JSONField(null=True, blank=True)
    centroid = models.JSONField(null=True, blank=True)

    class Meta:
        unique_together = [("school", "name")]

    def __str__(self) -> str:
        return self.name
