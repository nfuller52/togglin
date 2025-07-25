import * as z from "zod";

export const TokenResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});
