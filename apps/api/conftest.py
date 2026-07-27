"""Shared pytest fixtures: schools, users, and an authenticated admin client."""

from __future__ import annotations

import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

from busla.tenancy.models import School

User = get_user_model()


@pytest.fixture
def school(db) -> School:
    return School.objects.create(name="Demo School", name_ar="مدرسة")


@pytest.fixture
def other_school(db) -> School:
    return School.objects.create(name="Other School")


@pytest.fixture
def admin_user(db, school) -> User:
    user = User.objects.create(email="admin@x.dev", full_name="Admin", user_type="ADMIN", school=school)
    user.set_password("pw")
    user.save()
    return user


@pytest.fixture
def parent_user(db, school) -> User:
    user = User.objects.create(email="parent@x.dev", user_type="PARENT", school=school)
    user.set_password("pw")
    user.save()
    return user


@pytest.fixture
def admin_client(admin_user) -> APIClient:
    client = APIClient()
    client.force_authenticate(admin_user)
    return client
