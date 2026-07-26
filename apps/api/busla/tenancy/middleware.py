"""Resolves the current School from the authenticated user for the request lifetime."""

from __future__ import annotations

from collections.abc import Callable

from django.http import HttpRequest, HttpResponse

from .managers import set_current_school


class CurrentSchoolMiddleware:
    def __init__(self, get_response: Callable[[HttpRequest], HttpResponse]) -> None:
        self.get_response = get_response

    def __call__(self, request: HttpRequest) -> HttpResponse:
        user = getattr(request, "user", None)
        school_id = getattr(user, "school_id", None) if user else None
        set_current_school(str(school_id) if school_id else None)
        try:
            return self.get_response(request)
        finally:
            set_current_school(None)
