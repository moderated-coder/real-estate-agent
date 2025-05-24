import { http, HttpResponse } from "msw";
import { mockProperties } from "./mockData";
export const handlers = [
  http.get("/api/properties", ({ request }) => {
    return HttpResponse.json(mockProperties);
  }),
];
