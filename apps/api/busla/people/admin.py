from django.contrib import admin

from .models import Driver, Guardian, Student, Supervisor


class GuardianInline(admin.TabularInline):
    model = Guardian
    extra = 0


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ["full_name", "grade", "class_name", "bus", "status", "school"]
    list_filter = ["status", "grade"]
    search_fields = ["full_name", "phone"]
    inlines = [GuardianInline]


@admin.register(Driver)
class DriverAdmin(admin.ModelAdmin):
    list_display = ["full_name", "phone", "bus", "status", "school"]
    list_filter = ["status"]
    search_fields = ["full_name", "phone", "national_id"]


@admin.register(Supervisor)
class SupervisorAdmin(admin.ModelAdmin):
    list_display = ["full_name", "phone", "bus", "status", "school"]
    list_filter = ["status"]
    search_fields = ["full_name", "phone", "national_id"]
