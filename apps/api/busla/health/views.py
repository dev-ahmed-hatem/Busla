from __future__ import annotations

from django.utils import timezone
from drf_spectacular.utils import extend_schema
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import HealthSerializer


class HealthView(APIView):
    """Unauthenticated liveness probe."""

    permission_classes = [AllowAny]
    authentication_classes: list = []

    @extend_schema(responses=HealthSerializer, operation_id="health_retrieve")
    def get(self, request: Request) -> Response:
        payload = {
            "status": "ok",
            "service": "busla-api",
            "version": "0.1.0",
            "time": timezone.now(),
        }
        return Response(HealthSerializer(payload).data)
