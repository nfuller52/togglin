import { z } from "zod";

export const PaginationParamsScheam = z
  .object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).default(100),
  })
  .strict();

export type PaginationParams = z.infer<typeof PaginationParamsScheam>;
