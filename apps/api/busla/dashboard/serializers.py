from __future__ import annotations

from rest_framework import serializers


class KpiSerializer(serializers.Serializer):
    total = serializers.IntegerField()
    active = serializers.IntegerField()
    inactive = serializers.IntegerField()
    utilization = serializers.FloatField()


class CapacityRowSerializer(serializers.Serializer):
    bus = serializers.CharField()
    route = serializers.CharField(allow_null=True)
    capacity = serializers.IntegerField()
    occupied = serializers.IntegerField()
    available = serializers.IntegerField()


class DashboardStatsSerializer(serializers.Serializer):
    buses = KpiSerializer()
    drivers = KpiSerializer()
    supervisors = KpiSerializer()
    students = KpiSerializer()
    bus_capacity = CapacityRowSerializer(many=True)
