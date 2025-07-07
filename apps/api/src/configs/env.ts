import { z } from "zod";

const EnvSchema = z.object({
  // Application
  NODE_ENV: z.enum(["local", "test"]).default("local"),

  // Server
  PORT: z.coerce.number().default(4000),

  // Database
  DATABASE_NAME: z.string().default("togglin_local"),
  DATABASE_HOST: z.string().default("localhost"),
  DATABASE_PORT: z.coerce.number().default(5432),
  DATABASE_USER: z.string().default("togglin"),
  DATABASE_PASSWORD: z.string().default("togglin"),
  DATABASE_POOL_MAX: z.coerce.number().default(10),
  DATABASE_MIGRATION_USER: z.string().default(""),
  DATABASE_MIGRATION_PASSWORD: z.string().default(""),
});

export const env = EnvSchema.parse(process.env);
