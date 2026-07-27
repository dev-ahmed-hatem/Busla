"""People API: students (+ guardians), drivers, supervisors — CRUD, scoping, roles."""

from __future__ import annotations

from rest_framework.test import APIClient

from busla.people.models import Driver, Student, Supervisor

STUDENTS = "/api/v1/students/"
DRIVERS = "/api/v1/drivers/"
SUPERVISORS = "/api/v1/supervisors/"
GUARDIANS = "/api/v1/guardians/"


def test_student_create_list_and_nested_guardians(admin_client):
    created = admin_client.post(STUDENTS, {"full_name": "Ahmed Ali", "status": "scheduled"}, format="json")
    assert created.status_code == 201
    sid = created.data["id"]

    guardian = admin_client.post(
        GUARDIANS,
        {"student": sid, "name": "Sara", "relationship": "mother", "is_primary": True},
        format="json",
    )
    assert guardian.status_code == 201

    detail = admin_client.get(f"{STUDENTS}{sid}/")
    assert detail.status_code == 200
    assert len(detail.data["guardians"]) == 1
    assert detail.data["guardians"][0]["name"] == "Sara"


def test_students_are_school_scoped(admin_client, school, other_school):
    Student.objects.create(school=school, full_name="Mine")
    Student.objects.create(school=other_school, full_name="Theirs")
    resp = admin_client.get(STUDENTS)
    assert resp.data["count"] == 1
    assert resp.data["results"][0]["full_name"] == "Mine"


def test_guardians_are_scoped_through_student(admin_client, school, other_school):
    mine = Student.objects.create(school=school, full_name="Mine")
    theirs = Student.objects.create(school=other_school, full_name="Theirs")
    from busla.people.models import Guardian

    Guardian.objects.create(student=mine, name="A")
    Guardian.objects.create(student=theirs, name="B")
    assert admin_client.get(GUARDIANS).data["count"] == 1


def test_parent_cannot_write(parent_user):
    client = APIClient()
    client.force_authenticate(parent_user)
    assert client.post(STUDENTS, {"full_name": "X"}, format="json").status_code == 403


def test_driver_and_supervisor_crud(admin_client):
    d = admin_client.post(DRIVERS, {"full_name": "Samy", "status": "active"}, format="json")
    assert d.status_code == 201
    s = admin_client.post(SUPERVISORS, {"full_name": "Abeer", "status": "active"}, format="json")
    assert s.status_code == 201
    assert admin_client.get(DRIVERS).data["count"] == 1
    assert admin_client.get(SUPERVISORS).data["count"] == 1


def test_driver_filter_by_status(admin_client, school):
    Driver.objects.create(school=school, full_name="A", status="active")
    Driver.objects.create(school=school, full_name="B", status="absent")
    assert admin_client.get(f"{DRIVERS}?status=absent").data["count"] == 1
