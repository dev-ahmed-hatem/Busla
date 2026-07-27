"""Root URL configuration.

All API routes are versioned under /api/v1/. Modules mount their routers here
as they are built (people, fleet, routing, …).
"""

from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
)

api_v1 = [
    path("health/", include("busla.health.urls")),
    path("auth/", include("busla.accounts.urls")),          # Phase 1
    path("", include("busla.fleet.urls")),                  # Phase 2
    path("", include("busla.people.urls")),                 # Phase 2
    path("", include("busla.dashboard.urls")),              # Phase 2 — aggregate stats
    path("", include("busla.routing.urls")),                # Phase 3 — route planning
    path("", include("busla.trips.urls")),                  # Phase 4 — trips / live tracking
    # path("", include("busla.trips.urls")),                # Phase 4
    # path("", include("busla.notifications.urls")),        # Phase 5
    # path("", include("busla.requests.urls")),             # Phase 5
]

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/", include((api_v1, "api"), namespace="v1")),
    # OpenAPI schema + docs
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path(
        "api/docs/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),
]
