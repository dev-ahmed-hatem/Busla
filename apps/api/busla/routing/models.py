"""Routing: optimized bus routes and their ordered stops."""

from __future__ import annotations

from django.db import models

from busla.common.models import BaseModel, TenantScopedModel


class Shift(models.TextChoices):
    MORNING = "morning", "Morning"
    AFTERNOON = "afternoon", "Afternoon"


class Route(TenantScopedModel):
    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        INCOMPLETE = "incomplete", "Incomplete"
        READY = "ready", "Ready"

    code = models.CharField(max_length=16)
    name = models.CharField(max_length=120, blank=True)
    shift = models.CharField(max_length=16, choices=Shift.choices, default=Shift.MORNING)
    area = models.CharField(max_length=120, blank=True)

    bus = models.ForeignKey("fleet.Bus", null=True, blank=True, on_delete=models.SET_NULL, related_name="routes")
    driver = models.ForeignKey("people.Driver", null=True, blank=True, on_delete=models.SET_NULL, related_name="routes")
    supervisor = models.ForeignKey("people.Supervisor", null=True, blank=True, on_delete=models.SET_NULL, related_name="routes")

    status = models.CharField(max_length=16, choices=Status.choices, default=Status.DRAFT)
    distance_km = models.FloatField(default=0)
    duration_min = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["code"]
        constraints = [
            models.UniqueConstraint(fields=["school", "code"], name="uniq_route_code_per_school"),
        ]

    def __str__(self) -> str:
        return self.code

    def recompute_status(self) -> None:
        """Ready needs a full crew + bus + at least one student; incomplete if a piece is missing."""
        has_students = self.students.filter(is_deleted=False).exists()
        if not has_students:
            self.status = self.Status.DRAFT
        elif self.bus_id and self.driver_id and self.supervisor_id:
            self.status = self.Status.READY
        else:
            self.status = self.Status.INCOMPLETE


class RouteStop(BaseModel):
    class Kind(models.TextChoices):
        SUPERVISOR_HOME = "supervisor_home", "Supervisor home"
        STUDENT = "student", "Student"
        SCHOOL = "school", "School"

    route = models.ForeignKey(Route, on_delete=models.CASCADE, related_name="stops")
    sequence = models.PositiveIntegerField(default=0)
    kind = models.CharField(max_length=20, choices=Kind.choices, default=Kind.STUDENT)
    student = models.ForeignKey(
        "people.Student", null=True, blank=True, on_delete=models.SET_NULL, related_name="route_stops"
    )
    label = models.CharField(max_length=200, blank=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    eta = models.TimeField(null=True, blank=True)

    class Meta:
        ordering = ["sequence"]

    def __str__(self) -> str:
        return f"{self.route.code} #{self.sequence} {self.label}"
