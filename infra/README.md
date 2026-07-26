# infra/

Local + deployment infrastructure.

- `docker/` — Dockerfiles (`api`, `web`) + `nginx.conf`.
- `compose/docker-compose.yml` — full local stack: PostGIS, Redis, API (ASGI), Celery
  `worker` + `worker_opt` (OR-Tools) + `beat`, web, nginx.

## Run

```bash
make up        # build + start everything
make migrate   # apply migrations
make down
```

Ports: API `8000`, web `3000`, nginx `8080`, Postgres `5432`, Redis `6379`.

## Mobile (Flutter) against local API

Emulators reach the host at `10.0.2.2` (Android) — the Flutter apps default to
`http://10.0.2.2:8000`. Override with `--dart-define=API_BASE_URL=…`.

## Google Maps keys

Two least-privilege keys (see `.env.example`): a server key (Distance Matrix + Geocoding,
IP-restricted) for the backend, and referrer/app-restricted client keys for web + mobile.
