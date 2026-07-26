from rest_framework import serializers


class HealthSerializer(serializers.Serializer):
    """Walking-skeleton payload — proves the DRF→OpenAPI→TS/Dart client loop."""

    status = serializers.ChoiceField(choices=["ok", "degraded"])
    service = serializers.CharField()
    version = serializers.CharField()
    time = serializers.DateTimeField()
