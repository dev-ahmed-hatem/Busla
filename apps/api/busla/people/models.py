"""People: students (+ guardians), drivers, and supervisors (nannies)."""

from __future__ import annotations

from django.db import models

from busla.common.models import BaseModel, TenantScopedModel


class StaffStatus(models.TextChoices):
    ACTIVE = "active", "Active"
    OFF_DUTY = "off_duty", "Off-Duty"
    ABSENT = "absent", "Absent"


class Student(TenantScopedModel):
    class Status(models.TextChoices):
        SCHEDULED = "scheduled", "Scheduled"
        ABSENT = "absent", "Absent"
        UNSCHEDULED = "unscheduled", "Unscheduled"

    full_name = models.CharField(max_length=200)
    date_of_birth = models.DateField(null=True, blank=True)
    grade = models.CharField(max_length=32, blank=True)
    class_name = models.CharField(max_length=32, blank=True)
    area = models.CharField(max_length=120, blank=True)
    address = models.TextField(blank=True)
    phone = models.CharField(max_length=32, blank=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    bus = models.ForeignKey(
        "fleet.Bus", null=True, blank=True, on_delete=models.SET_NULL, related_name="students"
    )
    route = models.ForeignKey(
        "routing.Route", null=True, blank=True, on_delete=models.SET_NULL, related_name="students"
    )
    status = models.CharField(max_length=16, choices=Status.choices, default=Status.SCHEDULED)
    photo = models.ImageField(upload_to="students/", null=True, blank=True)

    class Meta:
        ordering = ["full_name"]

    def __str__(self) -> str:
        return self.full_name


class Guardian(BaseModel):
    class Relationship(models.TextChoices):
        MOTHER = "mother", "Mother"
        FATHER = "father", "Father"
        OTHER = "other", "Other"

    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="guardians")
    name = models.CharField(max_length=200)
    relationship = models.CharField(
        max_length=16, choices=Relationship.choices, default=Relationship.OTHER
    )
    phone = models.CharField(max_length=32, blank=True)
    email = models.EmailField(blank=True)
    is_primary = models.BooleanField(default=False)

    class Meta:
        ordering = ["-is_primary", "name"]

    def __str__(self) -> str:
        return self.name


class Driver(TenantScopedModel):
    full_name = models.CharField(max_length=200)
    phone = models.CharField(max_length=32, blank=True)
    national_id = models.CharField(max_length=32, blank=True)
    license_number = models.CharField(max_length=64, blank=True)
    license_expiry = models.DateField(null=True, blank=True)
    experience_years = models.PositiveIntegerField(null=True, blank=True)
    area = models.CharField(max_length=120, blank=True)
    bus = models.ForeignKey(
        "fleet.Bus", null=True, blank=True, on_delete=models.SET_NULL, related_name="drivers"
    )
    photo = models.ImageField(upload_to="drivers/", null=True, blank=True)
    status = models.CharField(max_length=16, choices=StaffStatus.choices, default=StaffStatus.ACTIVE)

    class Meta:
        ordering = ["full_name"]

    def __str__(self) -> str:
        return self.full_name


class Supervisor(TenantScopedModel):
    full_name = models.CharField(max_length=200)
    phone = models.CharField(max_length=32, blank=True)
    national_id = models.CharField(max_length=32, blank=True)
    area = models.CharField(max_length=120, blank=True)
    address = models.TextField(blank=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    bus = models.ForeignKey(
        "fleet.Bus", null=True, blank=True, on_delete=models.SET_NULL, related_name="supervisors"
    )
    photo = models.ImageField(upload_to="supervisors/", null=True, blank=True)
    status = models.CharField(max_length=16, choices=StaffStatus.choices, default=StaffStatus.ACTIVE)

    class Meta:
        ordering = ["full_name"]

    def __str__(self) -> str:
        return self.full_name
