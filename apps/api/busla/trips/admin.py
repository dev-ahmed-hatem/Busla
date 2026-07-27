from django.contrib import admin

from .models import Trip


@admin.register(Trip)
class TripAdmin(admin.ModelAdmin):
    list_display = ["route", "bus", "driver", "service_date", "shift", "status", "school"]
    list_filter = ["status", "shift", "service_date"]
    search_fields = ["route__code", "bus__bus_number", "driver__full_name"]
