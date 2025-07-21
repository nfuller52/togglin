import * as z from "zod";
import {
  emailErrorMessages,
  stringErrorMessages,
  uuidErrorMessages,
} from "../utils/schema-errors";

export const UserCreateSchema = z.object({
  name: z.string({ error: stringErrorMessages }),
  email: z.email({ error: emailErrorMessages }),
  authUserId: z.uuid({ error: uuidErrorMessages }),
});

export const UserUpdateSchema = z.object({
  name: z.string({ error: stringErrorMessages }).optional(),
  email: z.email({ error: emailErrorMessages }).optional(),
});

export const UserResponseSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  email: z.email(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type UserCreateParams = z.infer<typeof UserCreateSchema>;
