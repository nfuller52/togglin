export function errorResponseBody(message: string, errors: unknown[] = []) {
  return { message, errors };
}
