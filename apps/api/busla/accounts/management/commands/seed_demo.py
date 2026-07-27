"""Seed a demo school + one user per role so login is testable end-to-end.

Idempotent: safe to re-run. Dev credentials only.

    python manage.py seed_demo
"""

from __future__ import annotations

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.db import transaction

from busla.fleet.models import Bus
from busla.people.models import Driver, Guardian, Student, Supervisor
from busla.tenancy.models import School

User = get_user_model()

DEMO_BUSES = [
    ("Bus 05", "maintenance", "Engine"),
    ("Bus 06", "in_service", ""),
    ("Bus 07", "in_service", ""),
    ("Bus 08", "issue", "Electrical"),
    ("Bus 09", "maintenance", "Suspension"),
    ("Bus 10", "in_service", ""),
]
DEMO_DRIVERS = [("Samy Ahmed", "active"), ("Tarek Youssef", "off_duty"), ("Hassan Salah", "absent")]
DEMO_SUPERVISORS = [("Abeer Sayed", "active"), ("Dina Farouk", "off_duty"), ("Laila Hamdy", "absent")]
DEMO_STUDENTS = [
    ("Samy Ahmed", "scheduled"),
    ("Tarek Youssef", "scheduled"),
    ("Hassan Salah", "absent"),
    ("Sara Youssef", "unscheduled"),
]

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

        buses = []
        for number, bstatus, breakdown in DEMO_BUSES:
            bus, _ = Bus.objects.get_or_create(
                school=school,
                bus_number=number,
                defaults={
                    "status": bstatus,
                    "breakdown_reason": breakdown,
                    "capacity": 25,
                    "license_plate": "أ ب د 234",
                    "model_name": "Toyota Coaster",
                },
            )
            buses.append(bus)
        self.stdout.write(f"Buses: {len(buses)}")

        for i, (name, dstatus) in enumerate(DEMO_DRIVERS):
            Driver.objects.get_or_create(
                school=school, full_name=name,
                defaults={"status": dstatus, "phone": "011234567890", "area": "New Cairo", "bus": buses[i]},
            )
        for i, (name, sstatus) in enumerate(DEMO_SUPERVISORS):
            Supervisor.objects.get_or_create(
                school=school, full_name=name,
                defaults={"status": sstatus, "phone": "011234567890", "area": "New Cairo", "bus": buses[i]},
            )
        for i, (name, ststatus) in enumerate(DEMO_STUDENTS):
            student, created = Student.objects.get_or_create(
                school=school, full_name=name,
                defaults={
                    "status": ststatus, "grade": "Primary 3", "class_name": "3A",
                    "area": "New Cairo", "bus": buses[i % len(buses)],
                },
            )
            if created:
                Guardian.objects.create(
                    student=student, name="Sara Mohamed", relationship="mother",
                    phone="01234567789", email="sara@example.com", is_primary=True,
                )
        self.stdout.write(f"Drivers: {len(DEMO_DRIVERS)}  Supervisors: {len(DEMO_SUPERVISORS)}  Students: {len(DEMO_STUDENTS)}")

        self.stdout.write(self.style.SUCCESS(f"\nDone. Password for all demo users: {DEMO_PASSWORD}"))
