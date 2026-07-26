"""Base models & mixins inherited across every bounded-context app.

- BaseModel: UUID PK + created/updated + soft delete.
- TenantScopedModel: BaseModel + `school` FK, the row-level multi-tenancy key.
  A default tenant-scoped manager is attached in busla.tenancy to avoid a circular
  import; this module only defines the shape.
"""

from __future__ import annotations

import uuid

from django.db import models


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class SoftDeleteQuerySet(models.QuerySet):
    def alive(self) -> "SoftDeleteQuerySet":
        return self.filter(is_deleted=False)

    def delete(self):  # soft delete by default
        return self.update(is_deleted=True)

    def hard_delete(self):
        return super().delete()


class SoftDeleteModel(models.Model):
    is_deleted = models.BooleanField(default=False, db_index=True)

    objects = SoftDeleteQuerySet.as_manager()

    class Meta:
        abstract = True

    def delete(self, using=None, keep_parents=False):  # soft delete
        self.is_deleted = True
        self.save(update_fields=["is_deleted", "updated_at"])

    def hard_delete(self, using=None, keep_parents=False):
        super().delete(using=using, keep_parents=keep_parents)


class BaseModel(TimeStampedModel, SoftDeleteModel):
    """UUID-keyed, timestamped, soft-deletable base for all domain models."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    class Meta:
        abstract = True


class TenantScopedModel(BaseModel):
    """Every tenant-owned row carries its School. See busla.tenancy for scoping."""

    school = models.ForeignKey(
        "tenancy.School",
        on_delete=models.CASCADE,
        related_name="%(app_label)s_%(class)s_set",
    )

    class Meta:
        abstract = True
