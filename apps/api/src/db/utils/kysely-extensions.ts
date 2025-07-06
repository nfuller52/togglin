import type { OnModifyForeignAction } from "kysely";

import { CreateTableBuilder, sql } from "kysely";

declare module "kysely" {
  interface CreateTableBuilder<
    TB extends string,
    C extends string = never,
    O = undefined,
  > {
    addReference<NewCol extends string>(
      to: string,
      options: {
        columnName: NewCol;
        onDelete: OnModifyForeignAction;
        nullable?: boolean;
      },
    ): CreateTableBuilder<TB, C | NewCol, O>;
    addTimestamps(): CreateTableBuilder<TB, C | "created_at" | "updated_at", O>;
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
