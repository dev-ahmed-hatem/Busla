"""Display helpers: relative time + today/yesterday/earlier grouping."""

from __future__ import annotations

from datetime import datetime, timedelta

from django.utils import timezone


def group_of(dt: datetime) -> str:
    today = timezone.localdate()
    d = timezone.localtime(dt).date()
    if d == today:
        return "today"
    if d == today - timedelta(days=1):
        return "yesterday"
    return "earlier"


def humanize_time(dt: datetime) -> str:
    now = timezone.now()
    local = timezone.localtime(dt)
    today = timezone.localdate()
    d = local.date()
    if d == today:
        mins = max(0, (now - dt).total_seconds() / 60)
        if mins < 60:
            return f"{round(mins)} min ago"
        return f"{round(mins / 60)} hr ago"
    if d == today - timedelta(days=1):
        return f"Yesterday, {local.strftime('%I:%M %p')}"
    return local.strftime("%b %d, %I:%M %p")
