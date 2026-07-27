"""Shared DRF base for tenant-scoped management endpoints.

Every queryset is filtered to the current user's school (defence in depth on top of
the TenantManager), and creates stamp the school automatically.
"""

from __future__ import annotations

from rest_framework import viewsets

from busla.common.permissions import IsAdmin


class SchoolScopedModelViewSet(viewsets.ModelViewSet):
    """CRUD viewset scoped to the authenticated admin's school."""

    permission_classes = [IsAdmin]

    def get_queryset(self):
        qs = super().get_queryset()
        school_id = getattr(self.request.user, "school_id", None)
        if not school_id:
            return qs.none()
        return qs.filter(school_id=school_id, is_deleted=False)

    def perform_create(self, serializer):
        serializer.save(school_id=self.request.user.school_id)
