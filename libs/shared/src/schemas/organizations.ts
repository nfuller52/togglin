import * as z from "zod";
import { stringErrorMessages, uuidErrorMessages } from "../utils/schema-errors";

export const OrganizationCreateSchema = z.object({
  name: z.string({ error: stringErrorMessages }),
  ownerId: z.uuid({ error: uuidErrorMessages }),
});

export const OrganizationUpdateSchema = z.object({
  name: z.string({ error: stringErrorMessages }).optional(),
  ownerId: z.uuid({ error: uuidErrorMessages }).optional(),
});

export const OrganizationResponseSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  ownerId: z.uuid(),
});

export type OrganizationCreateParams = z.infer<typeof OrganizationCreateSchema>;
