"""Test settings — fast, eager, isolated. No Postgres/Redis required."""

from .base import *  # noqa: F401,F403

DEBUG = False
CELERY_TASK_ALWAYS_EAGER = True

PASSWORD_HASHERS = ["django.contrib.auth.hashers.MD5PasswordHasher"]

# In-memory SpatiaLite so the suite runs without a Postgres/PostGIS server.
DATABASES = {
    "default": {
        "ENGINE": "django.contrib.gis.db.backends.spatialite",
        "NAME": ":memory:",
    }
}

# Local-memory cache instead of Redis.
CACHES = {"default": {"BACKEND": "django.core.cache.backends.locmem.LocMemCache"}}

# In-memory channel layer for consumer tests (no Redis needed).
CHANNEL_LAYERS = {"default": {"BACKEND": "channels.layers.InMemoryChannelLayer"}}
