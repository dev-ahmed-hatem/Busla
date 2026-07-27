"""Expose the Celery app when Celery is installed (async stack, Phase 4).

The lean first release runs without Celery, so the import is optional.
"""

try:
    from .celery import app as celery_app

    __all__ = ("celery_app",)
except ModuleNotFoundError:  # celery not installed in the lean stack
    celery_app = None
    __all__ = ()
