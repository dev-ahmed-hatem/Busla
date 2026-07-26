import pytest
from rest_framework.test import APIClient


@pytest.mark.django_db
def test_health_ok():
    client = APIClient()
    resp = client.get("/api/v1/health/")
    assert resp.status_code == 200
    assert resp.data["status"] == "ok"
    assert resp.data["service"] == "busla-api"
