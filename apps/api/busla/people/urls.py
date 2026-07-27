from rest_framework.routers import DefaultRouter

from .views import DriverViewSet, GuardianViewSet, StudentViewSet, SupervisorViewSet

router = DefaultRouter()
router.register("students", StudentViewSet, basename="student")
router.register("drivers", DriverViewSet, basename="driver")
router.register("supervisors", SupervisorViewSet, basename="supervisor")
router.register("guardians", GuardianViewSet, basename="guardian")

urlpatterns = router.urls
