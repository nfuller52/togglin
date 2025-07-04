#!/bin/sh

set -euo pipefail

# Kysely migrator expects a single directory with all
# migrations. This script consolidates migrations from
# each module and sym-links them into a single dir.

SCRIPT_DIR=$(cd "$( dirname "$0" )" && pwd)
API_ROOT=$(cd "$SCRIPT_DIR/.." && pwd)
DEST_DIR="$API_ROOT/src/db/migrations"

# ensure the dir exists
mkdir -p "$DEST_DIR"

# reset the migrations directory
rm -f "$DEST_DIR"/*

# find each migration file and sym-link it. it's
# important that each file is numerically sorted
for dir in "$API_ROOT"/src/modules/*/migrations; do
  if [ -d "$dir" ]; then
    for file in "$dir"/*.ts; do
      [ -e "$file" ] || continue
      filename=$(basename "$file")
      ln -s "$file" "src/db/migrations/$filename"
    done
  fi
done
