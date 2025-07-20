/**
 * Trying this pattern, especially when catching query errors
 *
 * https://gist.github.com/t3dotgg/a486c4ae66d32bf17c09c73609dacc5b
 */

import { logger } from "@logger";

// Types for the result object with discriminated union
type Success<T> = {
  data: T;
  error: null;
};

type Failure<E> = {
  data: null;
  error: E;
};

type Result<T, E = Error> = Success<T> | Failure<E>;

// Main wrapper function
export async function tryCatch<T, E = Error>(
  promise: Promise<T>,
  logError: boolean = true,
): Promise<Result<T, E>> {
  try {
    const data = await promise;
    return { data, error: null };
  } catch (error) {
    if (logError) logger.error(error);

    return { data: null, error: error as E };
  }
}
