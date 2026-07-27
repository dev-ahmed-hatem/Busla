from rest_framework.routers import DefaultRouter

from .views import BusViewSet

router = DefaultRouter()
router.register("buses", BusViewSet, basename="bus")

urlpatterns = router.urls
