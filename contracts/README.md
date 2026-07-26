# contracts/

The **single source of truth** for cross-language API + realtime contracts.

- `openapi.yaml` — REST contract. Regenerated from the Django backend
  (`make openapi` → drf-spectacular). Drives codegen of the TS client
  (`packages/api-client-ts`) and Dart client (`flutter_packages/busla_core`).
- `asyncapi.yaml` — WebSocket channels + payload shapes (not covered by OpenAPI),
  hand-mirrored into `packages/realtime-ts` and `busla_core/realtime`.
- `scripts/` — `gen-ts.sh`, `gen-dart.sh`, `diff-check.sh`.

## Flow

```
DRF ──drf-spectacular──► openapi.yaml ──┬─ gen-ts.sh   → packages/api-client-ts/src/generated
                                        └─ gen-dart.sh → busla_core/lib/api/generated
```

Run `make codegen` after any backend API change. CI runs `make diff-check` and fails the
build if the committed `openapi.yaml` or generated clients are stale.
