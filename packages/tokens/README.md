# @busla/tokens

Design tokens (brand navy/amber, bus-yellow, status colors, spacing, radius, type) authored once
in `tokens/*.json` and built to:

- `dist/tokens.css` — CSS custom properties for the web app (Tailwind reads them via `var(--…)`).
- `dist/tokens.dart` — a `BuslaTokens` class consumed by `flutter_packages/busla_core`.
- `dist/tokens.json` — flat reference.

```bash
npm run build --workspace @busla/tokens
```

> Colors are calibrated placeholders derived from the Figma screens. Refine exact hex/spacing
> from Figma dev-mode (plan assumption #5); every surface updates from this one source.
