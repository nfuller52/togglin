import { add, formatISO } from "date-fns";

function now() {
  return new Date();
}

function secondsFromNow(seconds: number) {
  return add(new Date(), { seconds });
}

export const DateTime = { toISO: formatISO, now, secondsFromNow };
