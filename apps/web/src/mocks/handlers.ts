import { http, HttpResponse } from "msw";

// Example/Placeholder handler
// https://mswjs.io/docs/best-practices/structuring-handlers
export const handlers = [
  http.get("*/api/v1/users", () => {
    return HttpResponse.json({
      id: "this-is-the-way",
      firstName: "The",
      lastName: "Mandalorian",
    });
  }),
];
