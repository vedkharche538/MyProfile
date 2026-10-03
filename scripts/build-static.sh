#!/usr/bin/env bash
# build:static — produces a fully static `out/` directory suitable for GitHub Pages.
# Mirrors the `output: "export"` config in next.config.ts.

set -euo pipefail

echo "→ Building static export…"
NEXT_PUBLIC_BASE_PATH="${NEXT_PUBLIC_BASE_PATH:-}" bun run next build

echo "→ Static export ready at ./out"
ls -la out/ | head -20
