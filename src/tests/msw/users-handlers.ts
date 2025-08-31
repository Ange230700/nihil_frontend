// src\tests\msw\users-handlers.ts

import { faker } from "@nihil_frontend/tests/utils/faker";
import { http, HttpResponse, delay } from "msw";
import { USERS, querySlice } from "./fixtures/users";

export const userHandlers = [
  // GET /users (paginated & non-paginated)
  http.get("*/users", async ({ request }) => {
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get("limit");

    // Paginated variant for future UserListPaginated
    if (limitParam) {
      const limit = Math.max(1, Math.min(100, Number(limitParam) || 10));
      const cursor = searchParams.get("cursor");
      const q = searchParams.get("q");
      await delay(150); // show keepPreviousData behavior
      const page = querySlice({ q, limit, cursor });
      return HttpResponse.json(page, { status: 200 });
    }

    // Non-paginated (used by current UserList)
    await delay(50);
    return HttpResponse.json({ data: USERS.slice(0, 10) }, { status: 200 });
  }),

  // POST /users → create (kept minimal)
  http.post("*/users", async ({ request }) => {
    const body = (await request.json()) as {
      username: string;
      email: string;
      password: string;
    };
    const id = faker.string.uuid(); // realistic backend-style UUID
    const user = { id, username: body.username, email: body.email };
    USERS.unshift(user);
    return HttpResponse.json({ data: user }, { status: 201 });
  }),
];
