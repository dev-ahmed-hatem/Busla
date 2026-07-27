from rest_framework.routers import DefaultRouter

from .views import NotificationViewSet, ShiftReadinessViewSet

router = DefaultRouter()
router.register("notifications", NotificationViewSet, basename="notification")
router.register("shift-readiness", ShiftReadinessViewSet, basename="shift-readiness")

urlpatterns = router.urls
