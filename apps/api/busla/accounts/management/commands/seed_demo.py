"""Seed a demo school + one user per role so login is testable end-to-end.

Idempotent: safe to re-run. Dev credentials only.

    python manage.py seed_demo
"""

from __future__ import annotations

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.db import transaction

from busla.tenancy.models import School

User = get_user_model()

DEMO_PASSWORD = "busla1234"

DEMO_USERS = [
    ("admin@busla.dev", "Ahmed Saeed", "ADMIN"),
    ("driver@busla.dev", "Mohamed Ali", "DRIVER"),
    ("nanny@busla.dev", "Abeer Ahmed", "SUPERVISOR"),
    ("parent@busla.dev", "Sara Hussien", "PARENT"),
]


class Command(BaseCommand):
    help = "Seed a demo school and one user per role."

    @transaction.atomic
    def handle(self, *args, **options) -> None:
        school, created = School.objects.get_or_create(
            name="Busla Demo School",
            defaults={"name_ar": "مدرسة بصلة التجريبية"},
        )
        self.stdout.write(f"School: {'created' if created else 'exists'} — {school.name}")

        for email, full_name, user_type in DEMO_USERS:
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    "full_name": full_name,
                    "user_type": user_type,
                    "school": school,
                    "is_staff": user_type == "ADMIN",
                    "is_superuser": user_type == "ADMIN",
                },
            )
            if created:
                user.set_password(DEMO_PASSWORD)
                user.save(update_fields=["password"])
            self.stdout.write(
                f"  {user_type:<10} {email} {'(created)' if created else '(exists)'}"
            )

        self.stdout.write(self.style.SUCCESS(f"\nDone. Password for all demo users: {DEMO_PASSWORD}"))
