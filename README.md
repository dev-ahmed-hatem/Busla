# BUSLA

School-bus fleet operations & real-time tracking platform — a polyglot monorepo.

| Surface | Path | Stack |
|---|---|---|
| Web admin | `apps/web` | Next.js (App Router, TypeScript) |
| Backend API | `apps/api` | Django + DRF + Channels + Celery, PostgreSQL/PostGIS |
| Parent mobile app | `apps/parent_app` | Flutter |
| Driver/Nanny mobile app | `apps/driver_app` | Flutter |
| Shared TS | `packages/*` | tokens, ui, generated api client, configs |
| Shared Flutter | `flutter_packages/busla_core` | auth, api, models, realtime, design system, l10n, push |
| API/event contracts | `contracts/` | `openapi.yaml` (source of truth) + `asyncapi.yaml` |

See [`docs/SPEC.md`](docs/SPEC.md) for the product spec and the approved architecture/roadmap plan.

## Architecture in one paragraph

The backend (Django/DRF) is the single source of truth. It emits `contracts/openapi.yaml`
via drf-spectacular, from which we generate a **TypeScript client** (`packages/api-client-ts`,
consumed by the web app) and a **Dart client** (`flutter_packages/busla_core`, consumed by both
mobile apps). Realtime (GPS, trip progress, notifications) runs over Django Channels + Redis and
is documented in `contracts/asyncapi.yaml`. Design tokens live once in `packages/tokens` and are
emitted to both CSS variables (web) and `tokens.dart` (Flutter) so every surface shares the exact
palette and status-color system.

## Tooling per language island

| Island | Manager | Runner |
|---|---|---|
| TypeScript | pnpm workspaces | Turborepo |
| Python | Poetry | Makefile / pytest |
| Dart | Flutter SDK | Melos |

## Quick start

```bash
cp .env.example .env         # fill in Google Maps keys etc.
make install                 # pnpm install + poetry install + melos bootstrap
make up                      # docker compose: postgis, redis, api, workers, web
make migrate                 # apply DB migrations
```

- API → http://localhost:8000  (`GET /api/v1/health/`)
- Web → http://localhost:3000

### Regenerate API clients after changing the backend

```bash
make codegen                 # openapi.yaml + TS client + Dart client
```

CI fails if the contract or generated clients drift (`make diff-check`).

## Prerequisites

Docker, Node ≥ 20 + pnpm, Python 3.11 + Poetry, Flutter SDK. On Windows, run `make` targets
from Git Bash.

## Roadmap

Delivery proceeds in thin vertical slices across Phases 0–6 (Foundations → Auth → Fleet/People →
Route Optimization → Live Tracking → Notifications/Requests → Dashboard/Launch). This scaffold is
**Phase 0** — the walking skeleton. See the plan for slice-by-slice detail.
