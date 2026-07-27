from django.contrib import admin

from .models import Bus


@admin.register(Bus)
class BusAdmin(admin.ModelAdmin):
    list_display = ["bus_number", "license_plate", "status", "capacity", "school"]
    list_filter = ["status"]
    search_fields = ["bus_number", "license_plate"]
