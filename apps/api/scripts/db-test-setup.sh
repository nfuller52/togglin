#!/bin/sh

set -euo pipefail

SCRIPT_DIR=$(cd "$( dirname "$0" )" && pwd)
API_ROOT=$(cd "$SCRIPT_DIR/.." && pwd)
STRUCTURE_FILE=$API_ROOT/structure.sql
CONTAINER=togglin_db
DB=togglin_test
USER=postgres
PASSWORD=postgres

docker exec -e PGPASSWORD=$PASSWORD $CONTAINER \
  psql -U "$USER" -h localhost -d postgres -q -c "DROP DATABASE IF EXISTS $DB;"

docker exec -e PGPASSWORD=$PASSWORD $CONTAINER \
  psql -U "$USER" -h localhost -d postgres -q -c "CREATE DATABASE $DB;"

# stream the file to psql directly... clever, thanks AI!
cat $STRUCTURE_FILE | docker exec -i -e PGPASSWORD=$PASSWORD $CONTAINER \
  psql -U "$USER" -h localhost -d "$DB" -q

# NOT a fan of this... need to re-think database support as a whole
docker exec -e PGPASSWORD=$PASSWORD $CONTAINER \
  psql -U $USER -d postgres -q -c "DO \$\$ BEGIN
  CREATE ROLE togglin LOGIN PASSWORD 'togglin';
EXCEPTION WHEN duplicate_object THEN
  -- do nothing
END \$\$;"

docker exec -e PGPASSWORD=$PASSWORD $CONTAINER \
  psql -U $USER -d $DB -q -c "
GRANT CONNECT ON DATABASE $DB TO togglin;
GRANT USAGE ON SCHEMA public TO togglin;
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO togglin;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO togglin;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE ON TABLES TO togglin;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT EXECUTE ON FUNCTIONS TO togglin;
"
