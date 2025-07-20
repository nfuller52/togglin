import { errorResponseBody } from "@/lib/http/response";
import { HTTP } from "@/lib/http/status";

export const USERS_CREATE_ERRORS = {
  EMAIL_TAKEN: {
    statusCode: HTTP.CONFLICT,
    body: errorResponseBody("Bad Request", [], {
      email: { errors: ["Email is already in use."] },
    }),
  },
  CREATE_FAILED: {
    statusCode: HTTP.UNPROCESSABLE_ENTITY,
    body: errorResponseBody("Unable to create user record"),
  },
} as const;
