import { z } from "zod";
import { __ } from "../i18n";

export const PaginationParamsScheam = z
  .object({
    page: z.coerce
      .number({ error: __("validations.invalid_number") })
      .min(1)
      .default(1),
    limit: z.coerce
      .number({ error: __("validations.invalid_number") })
      .min(1)
      .max(1000)
      .default(100),
  })
  .strict();

export type PaginationParams = z.infer<typeof PaginationParamsScheam>;
