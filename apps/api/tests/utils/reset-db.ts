import { app } from "@app";
import { migrationDb as db } from "@db";
import { sql } from "kysely";

export async function truncateAll() {
  if (app.env.NODE_ENV !== "test" || app.env.DATABASE_NAME !== "togglin_test") {
    return;
  }

  await sql<string>`
    DO $$
      DECLARE
        r RECORD;
      BEGIN
        -- disable triggers and any RLS
        EXECUTE 'SET session_replication_role = replica';

        FOR r IN
          (SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename NOT IN ('kysely_migration', 'kysely_migration_lock'))
        LOOP
          EXECUTE 'TRUNCATE TABLE "' || r.tablename || '" CASCADE';
        END LOOP;

        EXECUTE 'SET session_replication_role = default';
    END $$;
  `.execute(db);
}
