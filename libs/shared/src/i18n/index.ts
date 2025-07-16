/**
 * this needs to be extracted to a proper library
 * we should consider moving some of these into a
 * shared library the frontend can also use
 */

const tempMapping = {
  "validations.invalid_number": "This field must be a valid number.",
  "validations.invalid_string": "This field must be a valid string.",
  "validations.invalid_uuid": "This field must be a valid v4 uuid.",
  "validations.required": "This field is required.",
} as const;

type TranslationKey = keyof typeof tempMapping;

type TranslationOptions = Record<string, string | number | boolean>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function __(key: TranslationKey, _options?: TranslationOptions): string {
  // eslint-disable-next-line security/detect-object-injection
  return tempMapping[key] ?? key;
}
