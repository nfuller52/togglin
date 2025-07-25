import * as z from "zod";
import { stringErrorMessages } from "../utils/schema-errors";

export const LoginCreateSchema = z.object({
  email: z.string({ error: stringErrorMessages }),
  password: z.string({ error: stringErrorMessages }),
});

export type LoginCreateParams = z.infer<typeof LoginCreateSchema>;
