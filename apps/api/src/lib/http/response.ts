export interface ErrorResponse {
  message: string;
  errors: string[];
  fieldErrors: Record<string, { errors: string[] }>;
}

export function errorResponseBody(
  message: string,
  errors?: string[],
  fieldErrors?: Record<string, { errors: string[] }>,
): ErrorResponse {
  const body: ErrorResponse = { message, errors: [], fieldErrors: {} };
  if (errors) body.errors = errors;
  if (fieldErrors) body.fieldErrors = fieldErrors;
  return body;
}
