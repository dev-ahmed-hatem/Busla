"""Tenant scoping helpers.

`TenantManager` filters querysets to the current request's school, resolved by
CurrentSchoolMiddleware and stored in a context var. Viewsets should still scope
in get_queryset() for defence in depth; this manager is the safety net.
"""

from __future__ import annotations

import contextvars

from django.db import models

_current_school_id: contextvars.ContextVar[str | None] = contextvars.ContextVar(
    "current_school_id", default=None
)


def set_current_school(school_id: str | None) -> None:
    _current_school_id.set(school_id)


def get_current_school() -> str | None:
    return _current_school_id.get()


class TenantQuerySet(models.QuerySet):
    def for_current_school(self) -> "TenantQuerySet":
        school_id = get_current_school()
        if school_id is None:
            return self
        return self.filter(school_id=school_id)


class TenantManager(models.Manager.from_queryset(TenantQuerySet)):
    """Default manager for tenant-scoped models."""
