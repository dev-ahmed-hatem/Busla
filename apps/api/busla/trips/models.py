"""Trips: a bus running a route on a service date, with lifecycle + last-known GPS."""

from __future__ import annotations

from django.db import models

from busla.common.models import TenantScopedModel
from busla.routing.models import Shift


class Trip(TenantScopedModel):
    class Status(models.TextChoices):
        SCHEDULED = "scheduled", "Scheduled"
        ON_TIME = "on_time", "On-time"
        DELAYED = "delayed", "Delayed"
        OFF_ROUTE = "off_route", "Off-route"
        BROKEN_DOWN = "broken_down", "Broken down"
        COMPLETED = "completed", "Completed"

    #: Statuses that count as a live/active journey.
    ACTIVE_STATUSES = ("on_time", "delayed", "off_route", "broken_down")

    route = models.ForeignKey("routing.Route", null=True, blank=True, on_delete=models.SET_NULL, related_name="trips")
    bus = models.ForeignKey("fleet.Bus", null=True, blank=True, on_delete=models.SET_NULL, related_name="trips")
    driver = models.ForeignKey("people.Driver", null=True, blank=True, on_delete=models.SET_NULL, related_name="trips")
    supervisor = models.ForeignKey("people.Supervisor", null=True, blank=True, on_delete=models.SET_NULL, related_name="trips")

    service_date = models.DateField()
    shift = models.CharField(max_length=16, choices=Shift.choices, default=Shift.MORNING)
    status = models.CharField(max_length=16, choices=Status.choices, default=Status.SCHEDULED)

    scheduled_departure = models.TimeField(null=True, blank=True)
    actual_departure = models.TimeField(null=True, blank=True)
    scheduled_arrival = models.TimeField(null=True, blank=True)
    actual_arrival = models.TimeField(null=True, blank=True)
    delay_minutes = models.PositiveIntegerField(default=0)

    # Last-known position — pushed by the driver's phone (see the `position` action).
    current_lat = models.FloatField(null=True, blank=True)
    current_lng = models.FloatField(null=True, blank=True)
    last_ping_at = models.DateTimeField(null=True, blank=True)
    current_stop_index = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["-service_date", "route__code"]

    def __str__(self) -> str:
        return f"{self.route.code if self.route_id else 'Trip'} @ {self.service_date}"

    # --- derived helpers (progress along the route's stops) ---

    @property
    def ordered_stops(self) -> list:
        return list(self.route.stops.all()) if self.route_id else []

    @property
    def is_active(self) -> bool:
        return self.status in self.ACTIVE_STATUSES

    def next_stop(self):
        stops = self.ordered_stops
        return stops[self.current_stop_index] if self.current_stop_index < len(stops) else None

    def progress_fraction(self) -> float:
        stops = self.ordered_stops
        last = max(1, len(stops) - 1)
        return min(1.0, self.current_stop_index / last)
