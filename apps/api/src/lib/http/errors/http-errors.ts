import { HTTP, HTTP_TEXT } from "@/lib/http/status";

export function isErrorStatus(status: number) {
  return status > 399;
}

export class HttpError extends Error {
  public statusCode: number;
  public details: unknown[];

  constructor(
    message: string,
    statusCode = HTTP.INTERNAL_SERVER_ERROR,
    details: unknown[] = [],
  ) {
    super(message);
    this.name = "HttpError";
    this.statusCode = statusCode;
    this.details = details;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HttpError);
    }
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message: string = HTTP_TEXT.UNAUTHORIZED) {
    super(message, HTTP.UNAUTHORIZED);
  }
}

export class ForbiddenError extends HttpError {
  constructor(message: string = HTTP_TEXT.FORBIDDEN) {
    super(message, HTTP.FORBIDDEN);
  }
}

export class BadRequestError extends HttpError {
  constructor(message: string = HTTP_TEXT.BAD_REQUEST) {
    super(message, HTTP.BAD_REQUEST);
  }
}

export class NotFoundError extends HttpError {
  constructor(message: string = HTTP_TEXT.NOT_FOUND) {
    super(message, HTTP.NOT_FOUND);
  }
}
