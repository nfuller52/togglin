import { config } from "dotenv";
import { z } from "zod";

const EnvSchema = z.object({
  // Application
  NODE_ENV: z.enum(["local", "test", "production"]),

  // Server
  LOG_LEVEL: z.string().default("info"),
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

export function loadEnvironment() {
  const appEnvironment = process.env.NODE_ENV ?? "local";

  if (["local", "test"].includes(appEnvironment)) {
    config({ path: `.env.${appEnvironment}`, quiet: true });
  }

  return EnvSchema.parse(process.env);
}
