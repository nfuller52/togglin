import { __ } from "../i18n";

export function stringErrorMessages(issue: any) {
  return issue.input === undefined
    ? __("validations.required")
    : __("validations.invalid_string");
}

export function uuidErrorMessages(issue: any) {
  return issue.input === undefined
    ? __("validations.required")
    : __("validations.invalid_uuid");
}
