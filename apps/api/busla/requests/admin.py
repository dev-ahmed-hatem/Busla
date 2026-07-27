from django.contrib import admin

from .models import ParentRequest


@admin.register(ParentRequest)
class ParentRequestAdmin(admin.ModelAdmin):
    list_display = ["student", "requested_area", "status", "occurred_at", "school"]
    list_filter = ["status"]
    search_fields = ["student__full_name"]
