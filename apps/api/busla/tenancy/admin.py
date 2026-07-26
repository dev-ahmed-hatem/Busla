from django.contrib import admin

from .models import School


@admin.register(School)
class SchoolAdmin(admin.ModelAdmin):
    list_display = ["name", "name_ar", "timezone", "is_active"]
    list_filter = ["is_active"]
    search_fields = ["name", "name_ar"]
