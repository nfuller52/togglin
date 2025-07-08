import { db } from "@/db/migrator";
import { createDefaultRls, rlsPolicyBuilder } from "@/db/utils/rls";

// const mockDb = new Kysely<unknown>({
//   dialect: new SqliteDialect({ database: {} as SqliteDatabase }),
// });

describe("createDefaultRls", () => {
  it("applies 5x default policies for organization", async () => {
    const tableName = "tenants_organizations";
    const checkFieldName = "id";
    const checkFieldDataType = "uuid";
    const sessionKey = "app.context.organization_id";

    await createDefaultRls(
      db,
      tableName,
      checkFieldName,
      checkFieldDataType,
      sessionKey,
    );

    expect(rlsPolicyBuilder).toHaveBeenCalledTimes(5);
  });
});

describe("rlsPolicyBuilder", () => {
  it("builds a USING policy with access denied", () => {
    const policy = rlsPolicyBuilder({
      tableName: "module_table",
      mode: "SELECT",
      strategy: "USING",
    });

    const { sql: sqlText, parameters } = policy.compile(db);

    expect(sqlText).toContain("CREATE POLICY rls_module_table_read_select");
    expect(sqlText).toContain('ON "module_table" FOR SELECT');
    expect(sqlText).toContain("USING (false);");
    expect(parameters).toEqual([]);
  });

  it("builds a WITH CHECK policy with access allowed", () => {
    const policy = rlsPolicyBuilder({
      tableName: "module_table",
      mode: "INSERT",
      strategy: "WITH CHECK",
      allowAccess: true,
    });

    const { sql: sqlText, parameters } = policy.compile(db);

    expect(sqlText).toContain("CREATE POLICY rls_module_table_mutate_insert");
    expect(sqlText).toContain('ON "module_table" FOR INSERT');
    expect(sqlText).toContain("WITH CHECK (true);");
    expect(parameters).toEqual([]);
  });

  it("generates a clause to check a field name and session key", () => {
    const policy = rlsPolicyBuilder({
      tableName: "auth_users",
      mode: "SELECT",
      strategy: "USING",
      checkFieldName: "user_id",
      checkFieldDataType: "uuid",
      sessionKey: "jwt.claims.user_id",
    });

    const { sql: sqlText, parameters } = policy.compile(db);

    expect(sqlText).toContain("CREATE POLICY rls_auth_users_read_select");
    expect(sqlText).toContain('ON "auth_users" FOR SELECT USING');
    expect(sqlText).toContain(
      "(user_id = current_setting('jwt.claims.user_id', false)::uuid);",
    );
    expect(parameters).toEqual([]);
  });

  it("sets the session key access", () => {
    const policy = rlsPolicyBuilder({
      tableName: "auth_users",
      mode: "SELECT",
      strategy: "USING",
      checkFieldName: "user_id",
      checkFieldDataType: "uuid",
      sessionKey: "jwt.claims.user_id",
      allowAccess: true,
    });

    const { sql: sqlText, parameters } = policy.compile(db);

    expect(sqlText).toContain("CREATE POLICY rls_auth_users_read_select");
    expect(sqlText).toContain('ON "auth_users" FOR SELECT USING');
    expect(sqlText).toContain(
      "(user_id = current_setting('jwt.claims.user_id', true)::uuid);",
    );
    expect(parameters).toEqual([]);
  });

  it("allows a custom policy name", () => {
    const policy = rlsPolicyBuilder({
      tableName: "tenants_organizations",
      mode: "UPDATE",
      strategy: "USING",
      policyName: "test_policy_name",
    });

    const { sql: sqlText, parameters } = policy.compile(db);

    expect(sqlText).toContain("CREATE POLICY test_policy_name");
    expect(sqlText).toContain('ON "tenants_organizations" FOR UPDATE');
    expect(sqlText).toContain("USING (false);");
    expect(parameters).toEqual([]);
  });
});
