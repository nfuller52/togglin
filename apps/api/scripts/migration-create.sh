#!/bin/sh

set -euo pipefail

# this script generates a migraiton file prefixed with
# a datetime (utc) when the migration was created

# two required args:
#   $1 module name
#   $2 hyphenated migration name (ex: "create-users")

if [ $# -lt 2 ]; then
  echo "ERROR: Missing one or more params <module-name> or <migration-name>"
  exit 1
fi

SCRIPT_DIR=$(cd "$( dirname "$0" )" && pwd)
API_ROOT=$(cd "$SCRIPT_DIR/.." && pwd)
MODULE="$1"
shift
MIGRATION_NAME="$(printf "%s-" "$@" | sed 's/-$//' | tr '[:upper:]' '[:lower:]')"
TIMESTAMP=$(date -u +"%Y%m%d%H%M%S")
FILENAME="${TIMESTAMP}-${MIGRATION_NAME}.ts"
MODULE_DIR="${API_ROOT}/src/modules/${MODULE}"
MIGRATION_DIR="${MODULE_DIR}/migrations"
OUTPUT_FILEPATH="${MIGRATION_DIR}/${FILENAME}"

# make sure the module dir exists
if [ ! -d "$MODULE_DIR" ]; then
  echo "ERROR: Invalid module directory"
  exit 1
fi

# low risk here because of the timestamp
# but verify the migration file does not already exist
if [ -e "$OUTPUT_FILEPATH" ]; then
  echo "ERROR: Migration already exists for $FILENAME"
  exit 1
fi

mkdir -p "$MIGRATION_DIR"

cat > "$OUTPUT_FILEPATH" <<EOF
import type { Kysely } from "kysely";

import "@/lib/db/utils/kysely-extensions";

const TABLE_NAME = "";

export async function up(db: Kysely<unknown>): Promise<void> {
  // Migration code
}

export async function down(db: Kysely<unknown>): Promise<void> {
  // Migration code
}

EOF

echo "$OUTPUT_FILEPATH"
