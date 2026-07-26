"""Role-based permission classes. Object-level scoping is additionally enforced
in each viewset's get_queryset() to prevent cross-tenant / cross-role leakage.
"""

from __future__ import annotations

from rest_framework.permissions import BasePermission


class IsAdmin(BasePermission):
    def has_permission(self, request, view) -> bool:
        user = request.user
        return bool(
            user
            and user.is_authenticated
            and user.user_type in {"ADMIN", "DISPATCHER", "VIEWER"}
        )


class IsDriverOrSupervisor(BasePermission):
    def has_permission(self, request, view) -> bool:
        user = request.user
        return bool(
            user and user.is_authenticated and user.user_type in {"DRIVER", "SUPERVISOR"}
        )


class IsParent(BasePermission):
    def has_permission(self, request, view) -> bool:
        user = request.user
        return bool(user and user.is_authenticated and user.user_type == "PARENT")
