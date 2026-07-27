"""Parent requests — pickup/zone changes submitted for a student, reviewed by admins."""

from __future__ import annotations

from django.db import models
from django.utils import timezone

from busla.common.models import TenantScopedModel


class ParentRequest(TenantScopedModel):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        APPROVED = "approved", "Approved"
        REJECTED = "rejected", "Rejected"

    student = models.ForeignKey("people.Student", on_delete=models.CASCADE, related_name="parent_requests")
    requested_address = models.TextField(blank=True)
    requested_area = models.CharField(max_length=120, blank=True)
    reason = models.CharField(max_length=200, blank=True)
    status = models.CharField(max_length=16, choices=Status.choices, default=Status.PENDING)
    is_read = models.BooleanField(default=False)
    occurred_at = models.DateTimeField(default=timezone.now, db_index=True)

    class Meta:
        ordering = ["-occurred_at"]

    def __str__(self) -> str:
        return f"{self.student.full_name} — {self.get_status_display()}"
