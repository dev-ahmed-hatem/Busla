# BUSLA API

Django + DRF + Channels + Celery backend, PostgreSQL/PostGIS. Single source of truth for the
OpenAPI contract (`../../contracts/openapi.yaml`).

## Apps (bounded contexts)

`common` · `tenancy` · `accounts` · `people` · `fleet` · `routing` · `tracking` · `trips` ·
`notifications` · `requests` · `imports` · `reports`

Phase 0 ships `common`, `tenancy`, `accounts`, and a `health` endpoint. The rest are added
slice-by-slice per the roadmap.

## Local (without Docker)

```bash
poetry install
poetry run python manage.py migrate       # requires a PostGIS database
poetry run python manage.py runserver     # http://localhost:8000/api/v1/health/
poetry run python manage.py spectacular --file ../../contracts/openapi.yaml
poetry run pytest
```
