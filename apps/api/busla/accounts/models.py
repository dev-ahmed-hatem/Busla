"""Accounts: email-login User with a role, plus push DeviceToken."""

from __future__ import annotations

import uuid

from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models

from busla.common.models import TimeStampedModel

from .managers import UserManager


class UserType(models.TextChoices):
    ADMIN = "ADMIN", "Admin"
    DISPATCHER = "DISPATCHER", "Dispatcher"
    VIEWER = "VIEWER", "Viewer"
    DRIVER = "DRIVER", "Driver"
    SUPERVISOR = "SUPERVISOR", "Supervisor"
    PARENT = "PARENT", "Parent"


class User(AbstractBaseUser, PermissionsMixin, TimeStampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=32, blank=True)
    full_name = models.CharField(max_length=200, blank=True)
    user_type = models.CharField(
        max_length=16, choices=UserType.choices, default=UserType.ADMIN
    )
    locale = models.CharField(max_length=5, choices=[("en", "en"), ("ar", "ar")], default="en")
    # null = platform superadmin not bound to a single school
    school = models.ForeignKey(
        "tenancy.School", on_delete=models.CASCADE, null=True, blank=True, related_name="users"
    )
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS: list[str] = []

    def __str__(self) -> str:
        return self.email


class DeviceToken(TimeStampedModel):
    class Platform(models.TextChoices):
        IOS = "ios", "iOS"
        ANDROID = "android", "Android"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="devices")
    token = models.CharField(max_length=512)
    platform = models.CharField(max_length=10, choices=Platform.choices)
    is_active = models.BooleanField(default=True)

    class Meta:
        unique_together = [("user", "token")]
