#!/usr/bin/env bash
# Refresh the vendored pstack plugin from https://github.com/cursor/plugins/tree/main/pstack
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

git clone --depth 1 --filter=blob:none --sparse https://github.com/cursor/plugins.git "$TMP"
(
  cd "$TMP"
  git sparse-checkout set pstack
  SHA="$(git rev-parse HEAD)"
  VERSION="$(node -p "require('./pstack/plugin.json').version")"
  rm -rf "$ROOT/pstack"
  cp -a pstack "$ROOT/pstack"
  {
    echo "pstack ${VERSION} from https://github.com/cursor/plugins/tree/main/pstack"
    echo "upstream_commit=${SHA}"
  } >"$ROOT/pstack/VERSION"
)

echo "Synced pstack to $(cat "$ROOT/pstack/VERSION" | head -1)"