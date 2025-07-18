import { HttpErrorHandler } from "./http-error-handler";
import { InternalErrorHandler } from "./internal-error-handler";
import { MalformedJsonErrorHandler } from "./malformed-json-error-handler";
import { withContext } from "./with-context";
import { ZodErrorHandler } from "./zod-error-handler";

export const Middleware = {
  HttpErrorHandler,
  InternalErrorHandler,
  MalformedJsonErrorHandler,
  withContext,
  ZodErrorHandler,
};
