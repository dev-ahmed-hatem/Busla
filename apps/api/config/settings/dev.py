"""Development settings."""

from .base import *  # noqa: F401,F403
from .base import env

DEBUG = True
ALLOWED_HOSTS = ["*"]
CORS_ALLOW_ALL_ORIGINS = True

# Console email in dev.
EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

# Optionally run Celery tasks eagerly in dev when no worker is up.
CELERY_TASK_ALWAYS_EAGER = env.bool("CELERY_TASK_ALWAYS_EAGER", default=False)
