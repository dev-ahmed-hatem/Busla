# BUSLA API

Django + DRF backend. Single source of truth for the OpenAPI contract
(`../../contracts/openapi.yaml`).

Runs lean by default: **SQLite + WSGI**, no Docker/GDAL/Redis required. The realtime
(Channels/Daphne) and background (Celery) stacks gate on behind `USE_ASYNC`; Postgres/PostGIS
turn on via `DATABASE_URL`.

## Apps (bounded contexts)

`common` · `tenancy` · `accounts` · `health` · `fleet` · `people` · `routing` · `trips` ·
`notifications` · `requests` · `dashboard`

## Local (without Docker)

A local virtualenv lives at `.venv` (Python 3.10+, gitignored). On Windows use
`.venv/Scripts/python`; on macOS/Linux `.venv/bin/python`.

```bash
python -m venv .venv
.venv/Scripts/python -m pip install django djangorestframework djangorestframework-simplejwt \
  drf-spectacular django-environ django-filter django-cors-headers Pillow pytest pytest-django
.venv/Scripts/python manage.py migrate        # plain SQLite (db.sqlite3) by default
.venv/Scripts/python manage.py seed_demo       # demo data — see below
.venv/Scripts/python manage.py runserver       # http://localhost:8000/api/v1/health/
.venv/Scripts/python -m pytest
```

Regenerate the OpenAPI contract after model/serializer changes:

```bash
.venv/Scripts/python manage.py spectacular --file ../../contracts/openapi.yaml
```

## Demo data (`seed_demo`)

Populates a demo school (`Busla Demo School`) with a full, realistic dataset so every admin
screen is filled — dashboard KPIs, live tracking, journey logs, users, buses, notifications,
parent requests, and shift readiness. It forces the dependency-free **greedy** route planner,
so **OR-Tools is not required** (handy on PythonAnywhere), and is deterministic
(`random.seed(42)`).

```bash
python manage.py seed_demo             # seed once (no-op if already populated)
python manage.py seed_demo --reset     # wipe demo-school data and rebuild
python manage.py seed_demo --reset --students 625 --buses 24   # rescale
```

Flags: `--reset`, `--buses`, `--drivers`, `--supervisors`, `--students`.

Default dataset: **20 buses** (in-service / maintenance / issue), **24 drivers**,
**24 supervisors**, **300 students** (+ guardians), **~12 optimized routes**, **8 live
journeys** (with GPS positions), **~48 historical trip logs**, **11 notifications**, **8 pending
parent requests**, and **24 driver check-ins**.

Role logins (all password **`busla1234`**):

| Email | Role |
|---|---|
| `admin@busla.dev` | Admin |
| `driver@busla.dev` | Driver |
| `nanny@busla.dev` | Supervisor |
| `parent@busla.dev` | Parent |

## Media uploads (photos)

`Student`, `Driver`, `Supervisor`, and `Bus` each have a `photo` image field (plus
`School.logo`). Upload via multipart to the resource, e.g.:

```bash
curl -X PATCH /api/v1/students/<id>/ -H "Authorization: Bearer <token>" -F "photo=@avatar.png"
```

The serializer returns `photo` as an **absolute URL**. Files are written to
`MEDIA_ROOT` (`apps/api/mediafiles/`, gitignored). Locally, `runserver` serves them at
`/media/...` (only when `DEBUG=True`).

### Serving media on PythonAnywhere

PA (production) does **not** serve media through Django/WSGI — configure it in the **Web** tab:

1. **Static files** mapping → add:
   - URL: `/media/`
   - Directory: absolute `MEDIA_ROOT`, e.g. `/home/<you>/busla/apps/api/mediafiles`
2. Ensure **Pillow** is installed in the virtualenv (`pip install -r requirements.txt` includes it).
3. Make sure the `mediafiles/` directory exists and is writable (Django creates sub-folders on upload).
4. Prefer a prod settings module (`DEBUG=False`, real `ALLOWED_HOSTS`); the `/media/` mapping
   above works regardless of `DEBUG` because PA's web server serves it, not Django.

Then reload the web app — uploaded photos are reachable at `https://<you>.pythonanywhere.com/media/...`.

### Deploying demo data on PythonAnywhere

In the PA bash console, from `apps/api` with the virtualenv active:

```bash
python manage.py migrate
python manage.py seed_demo --reset
```

Then reload the web app and log in as `admin@busla.dev`.
