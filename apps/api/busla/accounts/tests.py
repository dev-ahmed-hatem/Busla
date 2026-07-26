"""Auth slice tests: login (+claims), me, refresh/blacklist, logout, devices,
password reset, and a role-permission smoke test. Runs on in-memory SpatiaLite
(see config.settings.test)."""

from __future__ import annotations

import pytest
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import AccessToken

from busla.accounts.models import DeviceToken
from busla.common.permissions import IsAdmin
from busla.tenancy.models import School

User = get_user_model()

PASSWORD = "busla1234"

LOGIN = "/api/v1/auth/login/"
REFRESH = "/api/v1/auth/refresh/"
LOGOUT = "/api/v1/auth/logout/"
ME = "/api/v1/auth/me/"
DEVICES = "/api/v1/auth/devices/"
RESET = "/api/v1/auth/password-reset/"
RESET_CONFIRM = "/api/v1/auth/password-reset/confirm/"


@pytest.fixture
def client() -> APIClient:
    return APIClient()


@pytest.fixture
def school(db) -> School:
    return School.objects.create(name="Demo School", name_ar="مدرسة تجريبية")


@pytest.fixture
def admin(db, school) -> User:
    user = User.objects.create(
        email="admin@busla.dev", full_name="Ahmed Saeed", user_type="ADMIN", school=school
    )
    user.set_password(PASSWORD)
    user.save()
    return user


@pytest.fixture
def parent(db, school) -> User:
    user = User.objects.create(
        email="parent@busla.dev", full_name="Sara Hussien", user_type="PARENT", school=school
    )
    user.set_password(PASSWORD)
    user.save()
    return user


def _login(client: APIClient, email: str, password: str = PASSWORD):
    return client.post(LOGIN, {"email": email, "password": password}, format="json")


# --- login -----------------------------------------------------------------


def test_login_returns_tokens_and_user_with_claims(client, admin, school):
    resp = _login(client, admin.email)
    assert resp.status_code == 200
    body = resp.data
    assert "access" in body and "refresh" in body
    assert body["user"]["email"] == admin.email
    assert body["user"]["user_type"] == "ADMIN"

    # Custom claims embedded in the access token (avoids a DB hit downstream).
    access = AccessToken(body["access"])
    assert access["user_type"] == "ADMIN"
    assert access["school_id"] == str(school.id)


def test_login_bad_credentials_rejected(client, admin):
    resp = _login(client, admin.email, password="wrong-password")
    assert resp.status_code == 401


# --- me --------------------------------------------------------------------


def test_me_requires_auth(client):
    assert client.get(ME).status_code == 401


def test_me_returns_current_user(client, admin):
    access = _login(client, admin.email).data["access"]
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")
    resp = client.get(ME)
    assert resp.status_code == 200
    assert resp.data["email"] == admin.email
    assert resp.data["full_name"] == "Ahmed Saeed"


# --- refresh / blacklist ---------------------------------------------------


def test_refresh_rotates_and_blacklists_old_token(client, admin):
    refresh = _login(client, admin.email).data["refresh"]

    rotated = client.post(REFRESH, {"refresh": refresh}, format="json")
    assert rotated.status_code == 200
    assert "access" in rotated.data

    # The rotated-away original refresh must no longer be usable.
    reused = client.post(REFRESH, {"refresh": refresh}, format="json")
    assert reused.status_code == 401


def test_logout_blacklists_refresh(client, admin):
    refresh = _login(client, admin.email).data["refresh"]

    out = client.post(LOGOUT, {"refresh": refresh}, format="json")
    assert out.status_code == 205

    reused = client.post(REFRESH, {"refresh": refresh}, format="json")
    assert reused.status_code == 401


# --- devices ---------------------------------------------------------------


def test_device_register_upserts_on_user_and_token(client, admin):
    access = _login(client, admin.email).data["access"]
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")

    first = client.post(DEVICES, {"token": "fcm-abc", "platform": "android"}, format="json")
    assert first.status_code == 201

    # Same (user, token) again with a different platform → update, not duplicate.
    second = client.post(DEVICES, {"token": "fcm-abc", "platform": "ios"}, format="json")
    assert second.status_code == 201

    devices = DeviceToken.objects.filter(user=admin, token="fcm-abc")
    assert devices.count() == 1
    assert devices.first().platform == "ios"


# --- password reset --------------------------------------------------------


def test_password_reset_request_is_non_enumerating(client, admin):
    # Unknown and known emails both return 200 — never reveal account existence.
    assert client.post(RESET, {"email": "nobody@busla.dev"}, format="json").status_code == 200
    assert client.post(RESET, {"email": admin.email}, format="json").status_code == 200


def test_password_reset_confirm_sets_new_password(client, admin):
    uid = urlsafe_base64_encode(force_bytes(admin.pk))
    token = default_token_generator.make_token(admin)
    new_password = "NewPass!23456"

    resp = client.post(
        RESET_CONFIRM,
        {"uid": uid, "token": token, "new_password": new_password},
        format="json",
    )
    assert resp.status_code == 200

    # Old password no longer works; new one does.
    assert _login(client, admin.email, password=PASSWORD).status_code == 401
    assert _login(client, admin.email, password=new_password).status_code == 200


def test_password_reset_confirm_rejects_bad_token(client, admin):
    uid = urlsafe_base64_encode(force_bytes(admin.pk))
    resp = client.post(
        RESET_CONFIRM,
        {"uid": uid, "token": "invalid-token", "new_password": "NewPass!23456"},
        format="json",
    )
    assert resp.status_code == 400


# --- role permission smoke -------------------------------------------------


@pytest.mark.django_db
def test_is_admin_permission_allows_admin_denies_parent(admin, parent, rf):
    perm = IsAdmin()
    request = rf.get("/")

    request.user = admin
    assert perm.has_permission(request, view=None) is True

    request.user = parent
    assert perm.has_permission(request, view=None) is False
