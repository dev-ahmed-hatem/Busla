"""Auth serializers: login (with custom JWT claims), user, device, password reset."""

from __future__ import annotations

from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import DeviceToken

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """Public shape of the current user (used by /me and login response)."""

    class Meta:
        model = User
        fields = ["id", "email", "full_name", "user_type", "locale", "phone", "school"]
        read_only_fields = fields


class LoginSerializer(TokenObtainPairSerializer):
    """Email+password login. Embeds role/school in the token and returns the user."""

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["user_type"] = user.user_type
        token["school_id"] = str(user.school_id) if user.school_id else None
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data["user"] = UserSerializer(self.user).data
        return data


class DeviceRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeviceToken
        fields = ["token", "platform"]


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()


class PasswordResetConfirmSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(write_only=True)

    def validate_new_password(self, value: str) -> str:
        validate_password(value)
        return value
