from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import TripsOverviewView, TripViewSet

router = DefaultRouter()
router.register("trips", TripViewSet, basename="trip")

# `trips/overview/` must precede the router's `trips/<pk>/` detail route.
urlpatterns = [path("trips/overview/", TripsOverviewView.as_view(), name="trips-overview")] + router.urls
