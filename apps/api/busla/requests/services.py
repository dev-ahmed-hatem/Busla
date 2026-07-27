"""Suggest a bus for a reassignment — the in-service bus with the most free seats."""

from __future__ import annotations

from django.db.models import Count, Q

from busla.fleet.models import Bus


def suggest_bus(school):
    buses = Bus.objects.filter(school=school, is_deleted=False, status="in_service").annotate(
        occupied=Count("students", filter=Q(students__is_deleted=False))
    )
    best = max(buses, key=lambda b: b.capacity - b.occupied, default=None)
    if best is None:
        return None
    seats_left = max(0, best.capacity - best.occupied)
    percent = round(best.occupied / best.capacity * 100) if best.capacity else 0
    return best, seats_left, percent
