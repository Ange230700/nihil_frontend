// src\tests\msw\posts-handlers.ts

import { faker } from "@nihil_frontend/tests/utils/faker";
import { http, HttpResponse, delay } from "msw";
import { POSTS, querySlice } from "./fixtures/posts";

/**
 * One path `/posts` serves two shapes in your app:
 *  - With ?limit=... => paginated endpoint (PostListPaginated)
 *  - Without         => non-paginated list (PostList)
 */
export const postHandlers = [
  // GET /posts (paginated & non-paginated)
  http.get(/\/posts$/, async ({ request }) => {
    // MSW v2: parse from the Request
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get("limit");

    // Paginated endpoint (used by fetchPosts in entities/post/api)
    if (limitParam) {
      const limit = Math.max(1, Math.min(100, Number(limitParam) || 10));
      const cursor = searchParams.get("cursor");
      const q = searchParams.get("q");
      await delay(150); // simulate latency to see keepPreviousData
      const page = querySlice({ q, limit, cursor });
      return HttpResponse.json(page, { status: 200 });
    }

    // Non-paginated simple list (used by PostList)
    await delay(50);
    return HttpResponse.json(
      { status: "success", data: POSTS.slice(0, 10) },
      { status: 200 },
    );
  }),

  // POST /posts => create
  http.post(/\/posts$/, async ({ request }) => {
    const body = (await request.json()) as { userId: string; content: string };
    const newId = faker.string.uuid();
    const post = {
      id: newId,
      userId: body.userId,
      content: body.content,
      createdAt: new Date().toISOString(),
    };
    POSTS.unshift(post);
    return HttpResponse.json(
      { status: "success", data: post },
      { status: 201 },
    );
  }),
];
