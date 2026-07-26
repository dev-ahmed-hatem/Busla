"""Auth endpoints: login, refresh, logout, me, device registration, password reset."""

from __future__ import annotations

from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from drf_spectacular.utils import OpenApiResponse, extend_schema
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .models import DeviceToken
from .serializers import (
    DeviceRegisterSerializer,
    LoginSerializer,
    PasswordResetConfirmSerializer,
    PasswordResetRequestSerializer,
    UserSerializer,
)

User = get_user_model()


class LoginView(TokenObtainPairView):
    """POST email+password → {access, refresh, user}."""

    serializer_class = LoginSerializer


class RefreshView(TokenRefreshView):
    """POST {refresh} → {access} (rotating; old refresh blacklisted)."""


class LogoutView(APIView):
    """POST {refresh} → blacklist it. Idempotent-ish (invalid token → 205)."""

    @extend_schema(request=None, responses={205: OpenApiResponse(description="Logged out")})
    def post(self, request: Request) -> Response:
        token = request.data.get("refresh")
        if token:
            try:
                RefreshToken(token).blacklist()
            except TokenError:
                pass
        return Response(status=status.HTTP_205_RESET_CONTENT)


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(responses=UserSerializer, operation_id="auth_me")
    def get(self, request: Request) -> Response:
        return Response(UserSerializer(request.user).data)


class DeviceView(APIView):
    """Register/refresh this user's push token (FCM/APNs)."""

    permission_classes = [IsAuthenticated]

    @extend_schema(request=DeviceRegisterSerializer, responses=DeviceRegisterSerializer)
    def post(self, request: Request) -> Response:
        serializer = DeviceRegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        DeviceToken.objects.update_or_create(
            user=request.user,
            token=serializer.validated_data["token"],
            defaults={"platform": serializer.validated_data["platform"], "is_active": True},
        )
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]
    authentication_classes: list = []

    @extend_schema(
        request=PasswordResetRequestSerializer,
        responses={200: OpenApiResponse(description="Reset email sent if the account exists")},
    )
    def post(self, request: Request) -> Response:
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = User.objects.filter(email__iexact=serializer.validated_data["email"]).first()
        if user:
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            # Dev: console email backend prints this. Prod: send a real templated email.
            user.email_user(
                subject="BUSLA password reset",
                message=f"Reset token: uid={uid} token={token}",
            )
        # Always 200 — never reveal whether an email exists.
        return Response(status=status.HTTP_200_OK)


class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]
    authentication_classes: list = []

    @extend_schema(
        request=PasswordResetConfirmSerializer,
        responses={200: OpenApiResponse(description="Password updated")},
    )
    def post(self, request: Request) -> Response:
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            uid = force_str(urlsafe_base64_decode(serializer.validated_data["uid"]))
            user = User.objects.get(pk=uid)
        except (User.DoesNotExist, ValueError, TypeError, OverflowError):
            return Response({"detail": "Invalid link"}, status=status.HTTP_400_BAD_REQUEST)
        if not default_token_generator.check_token(user, serializer.validated_data["token"]):
            return Response({"detail": "Invalid or expired token"}, status=status.HTTP_400_BAD_REQUEST)
        user.set_password(serializer.validated_data["new_password"])
        user.save(update_fields=["password"])
        return Response(status=status.HTTP_200_OK)
