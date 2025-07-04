import { z } from "zod";

const EnvSchema = z.object({
  // Application
  NODE_ENV: z.enum(["local"]).default("local"),

  // Server
  PORT: z.coerce.number().default(4000),
});

export const env = EnvSchema.parse(process.env);
