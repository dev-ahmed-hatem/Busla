#!/usr/bin/env bash
# Generate the Dart (dio) client from contracts/openapi.yaml into busla_core.
# Requires openapi-generator-cli (Java). Install: `npm i -g @openapitools/openapi-generator-cli`.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SPEC="$ROOT/contracts/openapi.yaml"
OUT="$ROOT/flutter_packages/busla_core/lib/api/generated"

mkdir -p "$OUT"

echo "→ Generating Dart client from $SPEC"
openapi-generator-cli generate \
  -i "$SPEC" \
  -g dart-dio \
  -o "$OUT" \
  --additional-properties=pubName=busla_api,nullableFields=true

echo "✓ Dart client generated → $OUT"
