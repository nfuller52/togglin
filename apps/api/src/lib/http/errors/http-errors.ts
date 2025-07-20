import type { ErrorResponse } from "@/lib/http/response";

import { HTTP, HTTP_TEXT } from "@/lib/http/status";

export function isErrorStatus(status: number) {
  return status > 399;
}

export class HttpError extends Error {
  public statusCode: number;
  public body: ErrorResponse;

  constructor({
    statusCode = HTTP.INTERNAL_SERVER_ERROR,
    body = { message: "Internal server error", errors: [], fieldErrors: {} },
  }: {
    statusCode: number;
    body: ErrorResponse;
  }) {
    super(body.message);
    this.name = "HttpError";
    this.statusCode = statusCode;
    this.body = body;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HttpError);
    }
  }
}

export class InternalServerError extends HttpError {
  constructor(
    body: ErrorResponse = {
      message: HTTP_TEXT.INTERNAL_SERVER_ERROR,
      errors: [],
      fieldErrors: {},
    },
  ) {
    super({ statusCode: HTTP.INTERNAL_SERVER_ERROR, body });
  }
}

export class UnauthorizedError extends HttpError {
  constructor(
    body: ErrorResponse = {
      message: HTTP_TEXT.UNAUTHORIZED,
      errors: [],
      fieldErrors: {},
    },
  ) {
    super({ statusCode: HTTP.UNAUTHORIZED, body });
  }
}

export class ForbiddenError extends HttpError {
  constructor(
    body: ErrorResponse = {
      message: HTTP_TEXT.FORBIDDEN,
      errors: [],
      fieldErrors: {},
    },
  ) {
    super({ statusCode: HTTP.FORBIDDEN, body });
  }
}

export class BadRequestError extends HttpError {
  constructor(
    body: ErrorResponse = {
      message: HTTP_TEXT.BAD_REQUEST,
      errors: [],
      fieldErrors: {},
    },
  ) {
    super({ statusCode: HTTP.BAD_REQUEST, body });
  }
}

export class UnprocessableEntityError extends HttpError {
  constructor(
    body: ErrorResponse = {
      message: HTTP_TEXT.UNPROCESSABLE_ENTITY,
      errors: [],
      fieldErrors: {},
    },
  ) {
    super({ statusCode: HTTP.UNPROCESSABLE_ENTITY, body });
  }
}

export class NotFoundError extends HttpError {
  constructor(
    body: ErrorResponse = {
      message: HTTP_TEXT.NOT_FOUND,
      errors: ["The requested resource was not found."],
      fieldErrors: {},
    },
  ) {
    super({ statusCode: HTTP.NOT_FOUND, body });
  }
}
