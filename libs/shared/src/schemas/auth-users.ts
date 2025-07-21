import * as z from "zod";
import {
  emailErrorMessages,
  stringErrorMessages,
} from "../utils/schema-errors";

export const AuthUserCreateSchema = z.object({
  email: z.email({ error: emailErrorMessages }),
  passwordHash: z.string({ error: stringErrorMessages }),
});

export type AuthUserCreateParams = z.infer<typeof AuthUserCreateSchema>;
