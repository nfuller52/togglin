import { errorResponseBody } from "@/lib/http/response";
import { HTTP, HTTP_TEXT } from "@/lib/http/status";

export const LOGINS_ERRORS = {
  INVALID_LOGIN: {
    statusCode: HTTP.UNPROCESSABLE_ENTITY,
    body: errorResponseBody(HTTP_TEXT.UNPROCESSABLE_ENTITY, [
      "Invalid email or password",
    ]),
  },
};

export const REGISTRATIONS_ERRORS = {
  USER_EXISTS: {
    statusCode: HTTP.CONFLICT,
    body: errorResponseBody("Bad Request", [], {
      email: { errors: ["Email is already in use."] },
    }),
  },
} as const;
