"""DEV/DEMO ONLY — advance each active trip one stop to fake movement.

Real positions come from the driver's phone via `POST /api/v1/trips/<id>/position/`.
This command stands in while the Flutter driver app is not yet built:

    python manage.py simulate_positions
"""

from __future__ import annotations

from django.core.management.base import BaseCommand
from django.utils import timezone

from busla.trips.models import Trip


class Command(BaseCommand):
    help = "DEV: advance active trips one stop to simulate GPS movement."

    def handle(self, *args, **options) -> None:
        advanced = 0
        for trip in Trip.objects.filter(status__in=Trip.ACTIVE_STATUSES, actual_arrival__isnull=True):
            stops = trip.ordered_stops
            if not stops:
                continue
            trip.current_stop_index = min(trip.current_stop_index + 1, len(stops) - 1)
            stop = stops[trip.current_stop_index]
            trip.current_lat, trip.current_lng = stop.latitude, stop.longitude
            trip.last_ping_at = timezone.now()
            trip.save(update_fields=["current_stop_index", "current_lat", "current_lng", "last_ping_at", "updated_at"])
            advanced += 1
        self.stdout.write(self.style.SUCCESS(f"Advanced {advanced} active trip(s)."))
