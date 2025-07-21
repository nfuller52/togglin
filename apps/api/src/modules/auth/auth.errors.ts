import { errorResponseBody } from "@/lib/http/response";
import { HTTP } from "@/lib/http/status";

export const REGISTRATIONS_ERRORS = {
  USER_EXISTS: {
    statusCode: HTTP.CONFLICT,
    body: errorResponseBody("Bad Request", [], {
      email: { errors: ["Email is already in use."] },
    }),
  },
} as const;
