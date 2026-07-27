"""Notifications feed + driver shift-readiness check-ins."""

from __future__ import annotations

from django.db import models
from django.utils import timezone

from busla.common.models import TenantScopedModel
from busla.routing.models import Shift


class Notification(TenantScopedModel):
    class Kind(models.TextChoices):
        BREAKDOWN = "breakdown", "Breakdown"
        OFF_ROUTE = "off_route", "Off route"
        TRIP_STARTED = "trip_started", "Trip started"
        DELAY = "delay", "Delay"
        COMPLETED = "completed", "Completed"
        PARENT_REQUEST = "parent_request", "Parent request"
        REMINDER = "reminder", "Reminder"
        INFO = "info", "Info"

    kind = models.CharField(max_length=20, choices=Kind.choices, default=Kind.INFO)
    title = models.CharField(max_length=200)
    subtitle = models.CharField(max_length=300, blank=True)
    is_read = models.BooleanField(default=False)
    # Explicit event time (settable so seeds can backdate) — drives display + grouping.
    occurred_at = models.DateTimeField(default=timezone.now, db_index=True)
    trip = models.ForeignKey("trips.Trip", null=True, blank=True, on_delete=models.SET_NULL, related_name="notifications")
    student = models.ForeignKey("people.Student", null=True, blank=True, on_delete=models.SET_NULL, related_name="notifications")

    class Meta:
        ordering = ["-occurred_at"]

    def __str__(self) -> str:
        return self.title


class DriverCheckIn(TenantScopedModel):
    class State(models.TextChoices):
        NO_RESPONSE = "no_response", "No response"
        PENDING = "pending", "Pending"
        CHECKED_IN = "checked_in", "Checked in"

    driver = models.ForeignKey("people.Driver", on_delete=models.CASCADE, related_name="checkins")
    service_date = models.DateField()
    shift = models.CharField(max_length=16, choices=Shift.choices, default=Shift.MORNING)
    state = models.CharField(max_length=16, choices=State.choices, default=State.NO_RESPONSE)
    checked_in_at = models.TimeField(null=True, blank=True)
    pending_minutes = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["state", "driver__full_name"]
        constraints = [
            models.UniqueConstraint(
                fields=["school", "driver", "service_date", "shift"], name="uniq_checkin_per_shift"
            ),
        ]

    def __str__(self) -> str:
        return f"{self.driver.full_name} — {self.get_state_display()}"
