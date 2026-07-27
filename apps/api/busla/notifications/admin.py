from django.contrib import admin

from .models import DriverCheckIn, Notification


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ["title", "kind", "is_read", "occurred_at", "school"]
    list_filter = ["kind", "is_read"]
    search_fields = ["title", "subtitle"]


@admin.register(DriverCheckIn)
class DriverCheckInAdmin(admin.ModelAdmin):
    list_display = ["driver", "service_date", "shift", "state", "checked_in_at", "school"]
    list_filter = ["state", "shift", "service_date"]
