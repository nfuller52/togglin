import * as z from "zod";
import { __ } from "../i18n";
import { stringErrorMessages } from "../utils/schema-errors";
import { UserCreateSchema, UserResponseSchema } from "./users";

export const RegistrationCreateSchema = UserCreateSchema.extend({
  password: z.string({ error: stringErrorMessages }),
  passwordConfirmation: z.string({ error: stringErrorMessages }),
})
  .refine((data) => data.password === data.passwordConfirmation, {
    message: __("validations.password.mismatch"),
    path: ["passwordConfirmation"],
  })
  .omit({ authUserId: true });

export const RegistrationResponseSchema = UserResponseSchema.omit({
  name: true,
});

export type RegistrationCreateParams = z.infer<typeof RegistrationCreateSchema>;
