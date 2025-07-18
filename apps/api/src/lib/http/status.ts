export const HTTP = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  RESET_CONTENT: 205,
  PARTIAL_CONTENT: 206,
  MULTI_STATUS: 207,
  MULTIPLE_CHOICES: 300,
  MOVED_PERMANENTLY: 301,
  FOUND: 302,
  SEE_OTHER: 303,
  NOT_MODIFIED: 304,
  USE_PROXY: 305,
  TEMPORARY_REDIRECT: 307,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  PAYMENT_REQUIRED: 402,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  NOT_ACCEPTABLE: 406,
  PROXY_AUTHENTICATION_REQUIRED: 407,
  REQUEST_TIMEOUT: 408,
  CONFLICT: 409,
  GONE: 410,
  LENGTH_REQUIRED: 411,
  PRECONDITION_FAILED: 412,
  PAYLOAD_TOO_LARGE: 413,
  URI_TOO_LONG: 414,
  UNSUPPORTED_MEDIA_TYPE: 415,
  RANGE_NOT_SATISFIABLE: 416,
  EXPECTATION_FAILED: 417,
  UNPROCESSABLE_ENTITY: 422,
  LOCKED: 423,
  FAILED_DEPENDENCY: 424,
  UPGRADE_REQUIRED: 426,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
  HTTP_VERSION_NOT_SUPPORTED: 505,
  INSUFFICIENT_STORAGE: 507,
  NOT_EXTENDED: 510,
} as const;

export const HTTP_TEXT = {
  /** 200 */
  OK: "OK",

  /** 201 */
  CREATED: "Created",

  /** 202 */
  ACCEPTED: "Accepted",

  /** 204 */
  NO_CONTENT: "No Content",

  /** 205 */
  RESET_CONTENT: "Reset Content",

  /** 206 */
  PARTIAL_CONTENT: "Partial Content",

  /** 207 */
  MULTI_STATUS: "Multi-Status",

  /** 300 */
  MULTIPLE_CHOICES: "Multiple Choices",

  /** 301 */
  MOVED_PERMANENTLY: "Moved Permanently",

  /** 302 */
  FOUND: "Found",

  /** 303 */
  SEE_OTHER: "See Other",

  /** 304 */
  NOT_MODIFIED: "Not Modified",

  /** 305 */
  USE_PROXY: "Use Proxy",

  /** 307 */
  TEMPORARY_REDIRECT: "Temporary Redirect",

  /** 400 */
  BAD_REQUEST: "Bad Request",

  /** 401 */
  UNAUTHORIZED: "Unauthorized",

  /** 402 */
  PAYMENT_REQUIRED: "Payment Required",

  /** 403 */
  FORBIDDEN: "Forbidden",

  /** 404 */
  NOT_FOUND: "Not Found",

  /** 405 */
  METHOD_NOT_ALLOWED: "Method Not Allowed",

  /** 406 */
  NOT_ACCEPTABLE: "Not Acceptable",

  /** 407 */
  PROXY_AUTHENTICATION_REQUIRED: "Proxy Authentication Required",

  /** 408 */
  REQUEST_TIMEOUT: "Request Timeout",

  /** 409 */
  CONFLICT: "Conflict",

  /** 410 */
  GONE: "Gone",

  /** 411 */
  LENGTH_REQUIRED: "Length Required",

  /** 412 */
  PRECONDITION_FAILED: "Precondition Failed",

  /** 413 */
  PAYLOAD_TOO_LARGE: "Payload Too Large",

  /** 414 */
  URI_TOO_LONG: "URI Too Long",

  /** 415 */
  UNSUPPORTED_MEDIA_TYPE: "Unsupported Media Type",

  /** 416 */
  RANGE_NOT_SATISFIABLE: "Range Not Satisfiable",

  /** 417 */
  EXPECTATION_FAILED: "Expectation Failed",

  /** 422 */
  UNPROCESSABLE_ENTITY: "Unprocessable Entity",

  /** 423 */
  LOCKED: "Locked",

  /** 424 */
  FAILED_DEPENDENCY: "Failed Dependency",

  /** 426 */
  UPGRADE_REQUIRED: "Upgrade Required",

  /** 500 */
  INTERNAL_SERVER_ERROR: "Internal Server Error",

  /** 501 */
  NOT_IMPLEMENTED: "Not Implemented",

  /** 502 */
  BAD_GATEWAY: "Bad Gateway",

  /** 503 */
  SERVICE_UNAVAILABLE: "Service Unavailable",

  /** 504 */
  GATEWAY_TIMEOUT: "Gateway Timeout",

  /** 505 */
  HTTP_VERSION_NOT_SUPPORTED: "HTTP Version Not Supported",

  /** 507 */
  INSUFFICIENT_STORAGE: "Insufficient Storage",

  /** 510 */
  NOT_EXTENDED: "Not Extended",
} as Record<keyof typeof HTTP, string>;
