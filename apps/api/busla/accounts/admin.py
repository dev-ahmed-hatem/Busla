from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import DeviceToken, User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    ordering = ["email"]
    list_display = ["email", "full_name", "user_type", "school", "is_active"]
    list_filter = ["user_type", "is_active", "is_staff"]
    search_fields = ["email", "full_name", "phone"]
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Profile", {"fields": ("full_name", "phone", "user_type", "locale", "school")}),
        ("Permissions", {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
    )
    add_fieldsets = (
        (None, {"classes": ("wide",), "fields": ("email", "password1", "password2", "user_type", "school")}),
    )


@admin.register(DeviceToken)
class DeviceTokenAdmin(admin.ModelAdmin):
    list_display = ["user", "platform", "is_active", "created_at"]
    list_filter = ["platform", "is_active"]
