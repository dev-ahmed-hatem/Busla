"""ASGI entrypoint — serves DRF (HTTP) and Channels (WebSocket) from one process.

WebSocket routes are added per-slice; Phase 0 ships an empty routing table.
"""

import os

from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from django.core.asgi import get_asgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.dev")

# Initialise Django ASGI application early to populate the app registry.
django_asgi_app = get_asgi_application()

# WebSocket URL patterns are registered here as tracking/notifications land (Phase 4+).
websocket_urlpatterns: list = []

application = ProtocolTypeRouter(
    {
        "http": django_asgi_app,
        "websocket": AllowedHostsOriginValidator(
            URLRouter(websocket_urlpatterns),
        ),
    }
)
