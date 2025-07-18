import { errorResponseBody } from "@/lib/http/response";
import { HTTP } from "@/lib/http/status";

export const USERS_CREATE_ERRORS = {
  EMAIL_TAKEN: {
    statusCode: HTTP.CONFLICT,
    body: errorResponseBody("Email is already taken"),
  },
  CREATE_FAILED: {
    statusCode: HTTP.UNPROCESSABLE_ENTITY,
    body: errorResponseBody("Unable to create user record"),
  },
} as const;
