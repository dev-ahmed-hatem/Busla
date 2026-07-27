from rest_framework.routers import DefaultRouter

from .views import ParentRequestViewSet

router = DefaultRouter()
router.register("requests", ParentRequestViewSet, basename="parent-request")

urlpatterns = router.urls
