import { ServiceFailure, ServiceSuccess } from "./types";

function serviceSuccess<T>(data: T): ServiceSuccess<T> {
  return {
    ok: true,
    error: null,
    data,
  };
}

function serviceError<E extends string>(error: E): ServiceFailure<E> {
  return {
    ok: false,
    error,
    data: null,
  };
}

export const Service = {
  error: serviceError,
  success: serviceSuccess,
};
