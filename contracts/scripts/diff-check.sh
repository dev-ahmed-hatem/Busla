#!/usr/bin/env bash
# CI gate: regenerate contract + clients and fail if anything drifts from committed output.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

echo "→ Regenerating openapi.yaml from the backend"
# In CI the api service is up; regenerate the schema then the clients.
make openapi
bash contracts/scripts/gen-ts.sh
bash contracts/scripts/gen-dart.sh

echo "→ Checking for drift"
if ! git diff --exit-code -- contracts/openapi.yaml packages/api-client-ts/src/generated flutter_packages/busla_core/lib/api/generated; then
  echo "✗ Contract or generated clients are stale. Run 'make codegen' and commit." >&2
  exit 1
fi

echo "✓ No drift — contract and clients are in sync."
