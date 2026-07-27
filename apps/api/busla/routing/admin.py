from django.contrib import admin

from .models import Route, RouteStop


class RouteStopInline(admin.TabularInline):
    model = RouteStop
    extra = 0


@admin.register(Route)
class RouteAdmin(admin.ModelAdmin):
    list_display = ["code", "name", "shift", "area", "bus", "driver", "supervisor", "status", "school"]
    list_filter = ["status", "shift", "area"]
    search_fields = ["code", "name"]
    inlines = [RouteStopInline]
