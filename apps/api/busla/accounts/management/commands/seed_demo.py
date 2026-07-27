"""Seed a demo school with a full, realistic dataset so every admin screen is populated.

Creates the four role logins plus buses, drivers, supervisors, students (+guardians),
optimized routes, live + historical trips, notifications, parent requests, and driver
check-ins. Runs on the lean SQLite stack (no OR-Tools needed — forces the greedy planner).

    python manage.py seed_demo            # seed once (skips if already populated)
    python manage.py seed_demo --reset    # wipe demo data and rebuild
    python manage.py seed_demo --students 300 --buses 24   # custom scale

Dev credentials only. Password for every demo user: busla1234
"""

from __future__ import annotations

import random
from datetime import date, time, timedelta

from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone

from busla.fleet.models import Bus
from busla.notifications.models import DriverCheckIn, Notification
from busla.people.models import Driver, Guardian, Student, Supervisor
from busla.requests.models import ParentRequest
from busla.routing.services import generate_routes
from busla.tenancy.models import School
from busla.trips.models import Trip

User = get_user_model()

DEPOT = (30.0074, 31.4913)  # ≈ New Cairo
DEMO_PASSWORD = "busla1234"

DEMO_USERS = [
    ("admin@busla.dev", "Ahmed Saeed", "ADMIN"),
    ("driver@busla.dev", "Mohamed Ali", "DRIVER"),
    ("nanny@busla.dev", "Abeer Ahmed", "SUPERVISOR"),
    ("parent@busla.dev", "Sara Hussien", "PARENT"),
]

# Areas with a rough offset from the depot so students cluster geographically → tidy routes.
AREAS = [
    ("El Tagamoa El Khames", 0.02, 0.01),
    ("New Cairo", 0.00, 0.00),
    ("Nasr City", -0.04, -0.05),
    ("Shorouk", 0.06, 0.05),
    ("Rehab", 0.04, 0.03),
    ("Madinaty", 0.08, 0.04),
    ("Heliopolis", -0.03, -0.05),
    ("Maadi", -0.07, -0.03),
    ("El Narges", 0.02, 0.02),
    ("El Yasmine", 0.01, 0.03),
]

FIRST_NAMES = [
    "Ahmed", "Mohamed", "Mahmoud", "Omar", "Youssef", "Ali", "Hassan", "Khaled", "Amr", "Tarek",
    "Sara", "Nour", "Layla", "Mariam", "Hana", "Salma", "Farida", "Aya", "Dina", "Rana",
    "Ziad", "Karim", "Adham", "Seif", "Mostafa", "Yasmin", "Habiba", "Malak", "Jana", "Lina",
]
LAST_NAMES = [
    "Hassan", "Ali", "Ibrahim", "Saeed", "Youssef", "Fahmy", "Nasser", "Salah", "Farouk", "Sayed",
    "Mansour", "Adel", "Kamal", "Zaki", "Abdelrahman", "Elsayed", "Gaber", "Hamdy", "Shawky", "Fouad",
]
GRADES = ["KG1", "KG2", "Primary 1", "Primary 2", "Primary 3", "Primary 4", "Primary 5", "Primary 6"]
CLASSES = ["A", "B", "C"]
BUS_MODELS = ["Toyota Coaster", "Mitsubishi Rosa", "Hyundai County", "Iveco Daily"]
BREAKDOWNS = ["Engine", "Brakes", "Suspension", "Electrical", "AC", "Tire"]


def _name() -> str:
    return f"{random.choice(FIRST_NAMES)} {random.choice(LAST_NAMES)}"


def _phone() -> str:
    return f"010{random.randint(10_000_000, 99_999_999)}"


def _coord_in(area: tuple[str, float, float]) -> tuple[float, float]:
    _, dlat, dlng = area
    return (
        DEPOT[0] + dlat + random.uniform(-0.012, 0.012),
        DEPOT[1] + dlng + random.uniform(-0.012, 0.012),
    )


class Command(BaseCommand):
    help = "Seed a demo school with a full dataset across every screen."

    def add_arguments(self, parser):
        parser.add_argument("--reset", action="store_true", help="Wipe demo data before seeding.")
        parser.add_argument("--buses", type=int, default=20)
        parser.add_argument("--drivers", type=int, default=24)
        parser.add_argument("--supervisors", type=int, default=24)
        parser.add_argument("--students", type=int, default=300)

    @transaction.atomic
    def handle(self, *args, **options) -> None:
        random.seed(42)  # reproducible dataset
        # Force the fast, dependency-free planner for seeding (OR-Tools may be absent on PA).
        settings.BUSLA_OPTIMIZER = "busla.routing.optimizers.GreedyOptimizer"

        school, created = School.objects.get_or_create(
            name="Busla Demo School",
            defaults={"name_ar": "مدرسة بصلة التجريبية"},
        )
        if school.latitude is None:
            school.latitude, school.longitude = DEPOT
            school.save(update_fields=["latitude", "longitude"])
        self.stdout.write(f"School: {'created' if created else 'exists'} - {school.name}")

        self._seed_users(school)

        if options["reset"]:
            self._wipe(school)
        elif Bus.objects.filter(school=school).exists():
            self.stdout.write(self.style.WARNING("Already populated — run with --reset to rebuild."))
            self.stdout.write(self.style.SUCCESS(f"\nDone. Password: {DEMO_PASSWORD}"))
            return

        buses = self._seed_buses(school, options["buses"])
        drivers = self._seed_drivers(school, options["drivers"], buses)
        supervisors = self._seed_supervisors(school, options["supervisors"], buses)
        self._seed_students(school, options["students"])

        routes = self._seed_routes(school, buses)
        self._seed_trips(school, routes, drivers)
        self._seed_notifications(school)
        self._seed_parent_requests(school)
        self._seed_checkins(school, drivers)

        self.stdout.write(
            self.style.SUCCESS(
                f"\nDone. Password for all demo users: {DEMO_PASSWORD}"
                f"\n  buses={len(buses)} drivers={len(drivers)} supervisors={len(supervisors)} "
                f"students={Student.objects.filter(school=school).count()} routes={len(routes)} "
                f"trips={Trip.objects.filter(school=school).count()}"
            )
        )

    # --- users -------------------------------------------------------------

    def _seed_users(self, school) -> None:
        for email, full_name, user_type in DEMO_USERS:
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    "full_name": full_name, "user_type": user_type, "school": school,
                    "is_staff": user_type == "ADMIN", "is_superuser": user_type == "ADMIN",
                },
            )
            if created:
                user.set_password(DEMO_PASSWORD)
                user.save(update_fields=["password"])
        self.stdout.write(f"Users: {len(DEMO_USERS)} role logins")

    # --- reset -------------------------------------------------------------

    def _wipe(self, school) -> None:
        for model in (Notification, DriverCheckIn, ParentRequest, Trip):
            model.objects.filter(school=school).hard_delete()
        from busla.routing.models import Route

        Route.objects.filter(school=school).hard_delete()  # cascades RouteStop
        Student.objects.filter(school=school).hard_delete()  # cascades Guardian
        for model in (Driver, Supervisor, Bus):
            model.objects.filter(school=school).hard_delete()
        self.stdout.write(self.style.WARNING("Wiped existing demo data (--reset)."))

    # --- fleet -------------------------------------------------------------

    def _seed_buses(self, school, n: int) -> list[Bus]:
        buses = []
        for i in range(1, n + 1):
            if i % 10 == 0:
                status, reason = Bus.Status.MAINTENANCE, random.choice(BREAKDOWNS)
            elif i % 9 == 0:
                status, reason = Bus.Status.ISSUE, random.choice(BREAKDOWNS)
            else:
                status, reason = Bus.Status.IN_SERVICE, ""
            buses.append(
                Bus.objects.create(
                    school=school, bus_number=f"Bus {i:02d}", status=status, breakdown_reason=reason,
                    capacity=random.choice([25, 30, 50]), license_plate=f"أ ب د {200 + i}",
                    model_name=random.choice(BUS_MODELS), odometer_km=random.randint(20_000, 150_000),
                    last_maintenance_at=(date.today() - timedelta(days=random.randint(10, 200))),
                )
            )
        self.stdout.write(f"Buses: {len(buses)}")
        return buses

    def _seed_drivers(self, school, n: int, buses: list[Bus]) -> list[Driver]:
        in_service = [b for b in buses if b.status == Bus.Status.IN_SERVICE]
        drivers = []
        for i in range(n):
            status = "absent" if i >= n - 2 else "off_duty" if i >= n - 4 else "active"
            bus = in_service[i] if status == "active" and i < len(in_service) else None
            drivers.append(
                Driver.objects.create(
                    school=school, full_name=_name(), status=status, phone=_phone(),
                    national_id=f"29{random.randint(10**11, 10**12 - 1)}",
                    license_number=f"DL-{random.randint(10000, 99999)}",
                    experience_years=random.randint(1, 20), area=random.choice(AREAS)[0], bus=bus,
                )
            )
        self.stdout.write(f"Drivers: {len(drivers)}")
        return drivers

    def _seed_supervisors(self, school, n: int, buses: list[Bus]) -> list[Supervisor]:
        in_service = [b for b in buses if b.status == Bus.Status.IN_SERVICE]
        sups = []
        for i in range(n):
            status = "absent" if i >= n - 3 else "off_duty" if i >= n - 6 else "active"
            lat, lng = _coord_in(random.choice(AREAS))
            bus = in_service[i] if status == "active" and i < len(in_service) else None
            sups.append(
                Supervisor.objects.create(
                    school=school, full_name=_name(), status=status, phone=_phone(),
                    national_id=f"28{random.randint(10**11, 10**12 - 1)}", area=random.choice(AREAS)[0],
                    address="New Cairo", bus=bus, latitude=lat, longitude=lng,
                )
            )
        self.stdout.write(f"Supervisors: {len(sups)}")
        return sups

    # --- students + guardians ---------------------------------------------

    def _seed_students(self, school, n: int) -> None:
        students = []
        for i in range(n):
            area = random.choice(AREAS)
            lat, lng = _coord_in(area)
            roll = random.random()
            status = "unscheduled" if roll < 0.10 else "absent" if roll < 0.15 else "scheduled"
            students.append(
                Student(
                    school=school, full_name=_name(), status=status,
                    date_of_birth=date(2015, 1, 1) - timedelta(days=random.randint(0, 2500)),
                    grade=random.choice(GRADES), class_name=random.choice(CLASSES),
                    area=area[0], address=f"Building {random.randint(1, 90)}, Street {random.randint(1, 60)}, {area[0]}",
                    phone=_phone(), latitude=lat, longitude=lng,
                )
            )
        Student.objects.bulk_create(students)

        guardians = []
        for s in students:
            guardians.append(Guardian(
                student=s, name=_name(), relationship=random.choice(["mother", "father"]),
                phone=_phone(), email=f"parent{random.randint(1000, 9999)}@example.com", is_primary=True,
            ))
            if random.random() < 0.4:
                guardians.append(Guardian(
                    student=s, name=_name(), relationship="other", phone=_phone(), is_primary=False,
                ))
        Guardian.objects.bulk_create(guardians)
        self.stdout.write(f"Students: {len(students)}  Guardians: {len(guardians)}")

    # --- routes ------------------------------------------------------------

    def _seed_routes(self, school, buses: list[Bus]) -> list:
        in_service = sum(1 for b in buses if b.status == Bus.Status.IN_SERVICE)
        routes = generate_routes(school, num_buses=min(in_service, 15), seats_per_bus=25)
        self.stdout.write(f"Routes: {len(routes)} (greedy planner)")
        return routes

    # --- trips (live + history) -------------------------------------------

    def _seed_trips(self, school, routes: list, drivers: list[Driver]) -> None:
        if not routes:
            return
        driver_by_bus = {d.bus_id: d for d in drivers if d.bus_id}
        today = timezone.localdate()
        now = timezone.now()
        S = Trip.Status
        routed = [r for r in routes if r.bus_id]

        # Live journeys today: mostly on-time, a couple delayed, one off-route + one breakdown.
        live_statuses = [S.ON_TIME] * 4 + [S.DELAYED, S.DELAYED, S.OFF_ROUTE, S.BROKEN_DOWN]
        active = 0
        for r, st in zip(routed[:8], live_statuses):
            stops = list(r.stops.all())
            if not stops:
                continue
            idx = max(1, len(stops) // 2)
            pos = stops[min(idx, len(stops) - 1)]
            Trip.objects.create(
                school=school, route=r, bus=r.bus, driver=driver_by_bus.get(r.bus_id), supervisor=r.supervisor,
                service_date=today, shift="morning", status=st,
                delay_minutes=(random.choice([8, 12, 18]) if st == S.DELAYED else 0),
                scheduled_departure=time(6, 0), scheduled_arrival=time(7, 15), actual_departure=time(6, 5),
                current_stop_index=idx, current_lat=pos.latitude, current_lng=pos.longitude,
                last_ping_at=now - timedelta(minutes=random.randint(1, 9)),
            )
            active += 1

        # Historical logs: past 6 days × several routes (mixed outcomes, all arrived).
        logs = 0
        for days in range(1, 7):
            d = today - timedelta(days=days)
            for r in routed[:8]:
                st = random.choice([S.ON_TIME, S.ON_TIME, S.ON_TIME, S.DELAYED, S.BROKEN_DOWN])
                delay = random.choice([5, 8, 12, 15]) if st == S.DELAYED else 0
                Trip.objects.create(
                    school=school, route=r, bus=r.bus, driver=driver_by_bus.get(r.bus_id), supervisor=r.supervisor,
                    service_date=d, shift="morning", status=st, delay_minutes=delay,
                    scheduled_departure=time(6, 0), scheduled_arrival=time(7, 30),
                    actual_departure=time(6, random.randint(0, 9)),
                    actual_arrival=time(7, random.randint(20, 55)),
                )
                logs += 1
        self.stdout.write(f"Trips: {active} live + {logs} logs")

    # --- notifications -----------------------------------------------------

    def _seed_notifications(self, school) -> None:
        now = timezone.now()
        K = Notification.Kind
        feed = [
            (K.BREAKDOWN, "Bus 12 Breakdown", "Engine issue near Al Yasmine St. Trip is stopped", timedelta(minutes=8), False),
            (K.OFF_ROUTE, "Bus 07 Off Route", "Off the planned route for more than 5 minutes", timedelta(minutes=25), False),
            (K.DELAY, "Delay Detected", "Bus 09 is delayed by 12 minutes", timedelta(minutes=40), False),
            (K.TRIP_STARTED, "Morning Trip Started", "Bus 05 started the morning trip", timedelta(hours=1), True),
            (K.PARENT_REQUEST, "Pickup Change Request", "A parent requested a pickup address change", timedelta(hours=2), False),
            (K.TRIP_STARTED, "Afternoon Trip Started", "Bus 02 started the afternoon trip", timedelta(days=1, hours=3), True),
            (K.COMPLETED, "Trip Completed", "Bus 06 completed the morning trip", timedelta(days=1, hours=4), True),
            (K.DELAY, "Delay Detected", "Bus 03 was delayed by 9 minutes", timedelta(days=1, hours=5), True),
            (K.COMPLETED, "Trip Completed", "Bus 08 completed the afternoon trip", timedelta(days=5, hours=2), True),
            (K.TRIP_STARTED, "Morning Trip Started", "Bus 05 started the morning trip", timedelta(days=6, hours=3), True),
            (K.INFO, "Maintenance Scheduled", "Bus 10 is due for maintenance", timedelta(days=6, hours=6), True),
        ]
        Notification.objects.bulk_create([
            Notification(school=school, kind=k, title=t, subtitle=s, is_read=r, occurred_at=now - ago)
            for k, t, s, ago, r in feed
        ])
        self.stdout.write(f"Notifications: {len(feed)}")

    def _seed_parent_requests(self, school) -> None:
        pool = list(Student.objects.filter(school=school)[:8])
        now = timezone.now()
        made = 0
        for i, st in enumerate(pool):
            new_area = random.choice([a[0] for a in AREAS if a[0] != st.area] or ["Shorouk"])
            ParentRequest.objects.create(
                school=school, student=st, requested_area=new_area,
                reason=random.choice(["Requested a pickup address change", "Minor stop adjustment needed"]),
                requested_address=f"Building {random.randint(1, 90)}, {new_area}",
                occurred_at=now - timedelta(minutes=12 * (i + 1)),
            )
            made += 1
        self.stdout.write(f"Parent requests: {made} pending")

    def _seed_checkins(self, school, drivers: list[Driver]) -> None:
        today = timezone.localdate()
        made = 0
        for i, d in enumerate(drivers):
            roll = random.random()
            if roll < 0.82:
                state, cat, pm = DriverCheckIn.State.CHECKED_IN, time(4, random.randint(0, 10)), 0
            elif roll < 0.92:
                state, cat, pm = DriverCheckIn.State.PENDING, None, random.choice([12, 18, 25])
            else:
                state, cat, pm = DriverCheckIn.State.NO_RESPONSE, None, 0
            DriverCheckIn.objects.create(
                school=school, driver=d, service_date=today, shift="morning",
                state=state, checked_in_at=cat, pending_minutes=pm,
            )
            made += 1
        self.stdout.write(f"Check-ins: {made}")
