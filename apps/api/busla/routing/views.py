from __future__ import annotations

from drf_spectacular.utils import extend_schema
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.response import Response

from busla.common.viewsets import SchoolScopedModelViewSet
from busla.people.models import Student

from .models import Route
from .serializers import OptimizeParamsSerializer, RouteSerializer
from .services import generate_routes


class RouteViewSet(SchoolScopedModelViewSet):
    queryset = Route.objects.all().prefetch_related("stops", "students")
    serializer_class = RouteSerializer
    filterset_fields = ["status", "shift", "area", "bus"]
    search_fields = ["code", "name"]
    ordering_fields = ["code", "status", "distance_km", "duration_min"]

    def perform_create(self, serializer):
        route = serializer.save(school_id=self.request.user.school_id)
        route.recompute_status()
        route.save(update_fields=["status", "updated_at"])

    def perform_update(self, serializer):
        route = serializer.save()
        route.recompute_status()
        route.save(update_fields=["status", "updated_at"])

    @extend_schema(request=OptimizeParamsSerializer, responses=RouteSerializer(many=True))
    @action(detail=False, methods=["post"])
    def optimize(self, request: Request) -> Response:
        params = OptimizeParamsSerializer(data=request.data)
        params.is_valid(raise_exception=True)
        routes = generate_routes(
            request.user.school,
            num_buses=params.validated_data["num_buses"],
            seats_per_bus=params.validated_data["seats_per_bus"],
            shift=params.validated_data["shift"],
        )
        return Response(RouteSerializer(routes, many=True).data, status=201)

    @extend_schema(responses={200: dict})
    @action(detail=False, methods=["get"])
    def readiness(self, request: Request) -> Response:
        school_id = request.user.school_id
        return Response(
            {
                "students_ready": Student.objects.filter(
                    school_id=school_id, is_deleted=False, latitude__isnull=False
                ).count(),
                "routes_count": Route.objects.filter(school_id=school_id, is_deleted=False).count(),
            }
        )
