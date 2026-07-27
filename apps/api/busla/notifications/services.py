"""Create notifications. Called from seeds, request approvals, shift reminders, and
(when trip lifecycle actions land) trip status changes."""

from __future__ import annotations

from django.utils import timezone

from .models import Notification


def notify(school, kind, title, subtitle="", *, trip=None, student=None, occurred_at=None):
    return Notification.objects.create(
        school=school,
        kind=kind,
        title=title,
        subtitle=subtitle,
        trip=trip,
        student=student,
        occurred_at=occurred_at or timezone.now(),
    )
