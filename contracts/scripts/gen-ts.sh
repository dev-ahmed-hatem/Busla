#!/usr/bin/env bash
# Generate the TypeScript client from contracts/openapi.yaml into packages/api-client-ts.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SPEC="$ROOT/contracts/openapi.yaml"
OUT="$ROOT/packages/api-client-ts/src/generated"

mkdir -p "$OUT"

echo "→ Generating TS types from $SPEC"
# openapi-typescript emits fully-typed paths/components; runtime fetch is via openapi-fetch.
npm exec --workspace @busla/api-client-ts -- openapi-typescript "$SPEC" -o "$OUT/schema.ts"

echo "✓ TS client generated → $OUT/schema.ts"
