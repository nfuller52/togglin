import type { OnModifyForeignAction } from "kysely";

import { CreateTableBuilder, sql } from "kysely";

declare module "kysely" {
  interface CreateTableBuilder<
    TB extends string,
    C extends string = never,
    O = undefined,
  > {
    /**
     * Adds a foreign key reference column to the current table.
     *
     * This method creates a column on the current table that references the `id` of a target table.
     *
     * @param to - The name of the referenced table.
     * @param options - Options for the foreign key:
     * - options.columnName - The name of the column on this table.
     * - options.onDelete - The `ON DELETE` behavior (e.g., 'cascade', 'restrict').
     * - options.nullable - Whether the column is nullable (default: `true`).
     *
     * @returns A new `CreateTableBuilder` with the additional column.
     *
     * @example
     * ```ts
     * await db.schema
     *   .createTable("organization_memberships")
     *   .addUUIDPrimaryKey()
     *   .addReference("accounts_users", {
     *     columnName: "user_id",
     *     onDelete: "cascade",
     *   })
     *   .addReference("tenants_organizations", {
     *     columnName: "organization_id",
     *     onDelete: "cascade",
     *   })
     *   .execute();
     * ```
     */
    addReference<NewCol extends string>(
      to: string,
      options: {
        columnName: NewCol;
        onDelete: OnModifyForeignAction;
        nullable?: boolean;
      },
    ): CreateTableBuilder<TB, C | NewCol, O>;

    /**
     * Adds `created_at` and `updated_at` timestamp columns to the table.
     *
     * Both columns will default to `now()` and are marked as `NOT NULL`.
     *
     * @returns A new `CreateTableBuilder` with the timestamp columns added.
     */
    addTimestamps(): CreateTableBuilder<TB, C | "created_at" | "updated_at", O>;

    /**
     * Adds an `id` column as a UUID primary key to the table.
     *
     * The column is named `id`, uses the `uuid` type, and is set as the table's primary key.
     *
     * @returns A new `CreateTableBuilder` with the `id` column added.
     */
    addUUIDPrimaryKey(): CreateTableBuilder<TB, C | "id", O>;
  }
}

CreateTableBuilder.prototype.addTimestamps = function () {
  return this.addColumn("created_at", "timestamptz", (col) =>
    col.defaultTo(sql<string>`now()`).notNull(),
  ).addColumn("updated_at", "timestamptz", (col) =>
    col.defaultTo(sql<string>`now()`).notNull(),
  );
};

CreateTableBuilder.prototype.addUUIDPrimaryKey = function () {
  return this.addColumn("id", "uuid", (col) =>
    col.primaryKey().defaultTo(sql<string>`gen_random_uuid()`),
  );
};

CreateTableBuilder.prototype.addReference = function (
  to: string,
  options: {
    columnName: string;
    onDelete: OnModifyForeignAction;
    nullable?: boolean;
  },
) {
  return this.addColumn(options.columnName, "uuid", (col) => {
    const result = col.references(`${to}.id`).onDelete(options.onDelete);

    if (options.nullable === true) return result;

    return result.notNull();
  });
};
