# BUSLA API image — Django + DRF + Channels + Celery + GeoDjango (PostGIS client libs).
FROM python:3.11-slim AS base

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    POETRY_VERSION=1.8.4 \
    POETRY_VIRTUALENVS_CREATE=false

# GeoDjango needs GDAL/GEOS/PROJ; WeasyPrint needs pango/cairo.
RUN apt-get update && apt-get install -y --no-install-recommends \
    binutils libproj-dev gdal-bin libgdal-dev \
    libpango-1.0-0 libpangocairo-1.0-0 libgdk-pixbuf-2.0-0 \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir "poetry==${POETRY_VERSION}"

WORKDIR /app

# Install deps first for layer caching.
COPY apps/api/pyproject.toml /app/
RUN poetry install --no-root --no-interaction --no-ansi || true

COPY apps/api /app

EXPOSE 8000

# ASGI (serves DRF HTTP + Channels WebSocket).
CMD ["uvicorn", "config.asgi:application", "--host", "0.0.0.0", "--port", "8000"]
