import { z } from "zod";

const app_env = process.env.NODE_ENV ?? "local";

if (["local", "test"].includes(app_env)) {
  require("dotenv").config({
    path: `.env.${app_env}`,
    override: true,
    quiet: true,
  });
}

const EnvSchema = z.object({
  // Application
  NODE_ENV: z.enum(["local", "test"]).default("local"),

  // Server
  PORT: z.coerce.number().default(4000),

  // Database
  DATABASE_NAME: z.string(),
  DATABASE_HOST: z.string(),
  DATABASE_PORT: z.coerce.number(),
  DATABASE_USER: z.string(),
  DATABASE_PASSWORD: z.string(),
  DATABASE_POOL_MAX: z.coerce.number(),
  DATABASE_MIGRATION_USER: z.string(),
  DATABASE_MIGRATION_PASSWORD: z.string(),
});

export const env = EnvSchema.parse(process.env);
