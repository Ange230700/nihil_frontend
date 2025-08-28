// src\entities\post\api.ts

import { postApi } from "@nihil_frontend/api/api";
import {
  PostsPageSchema,
  type PostsPage,
} from "@nihil_frontend/entities/post/schemas";

interface ApiEnvelope<T> {
  status: "success" | "error";
  data: T;
}

function isEnvelope(x: unknown): x is ApiEnvelope<unknown> {
  return (
    typeof x === "object" &&
    x !== null &&
    "data" in (x as Record<string, unknown>)
  );
}

export async function fetchPosts(params: {
  limit: number;
  cursor?: string | null;
  q?: string;
  userId?: string;
}): Promise<PostsPage> {
  const usp = new URLSearchParams();
  usp.set("limit", String(params.limit));
  if (params.cursor) usp.set("cursor", params.cursor);
  if (params.q) usp.set("q", params.q);
  if (params.userId) usp.set("userId", params.userId);

  // Tell axios we expect an unknown payload so nothing is 'any'
  const resp = await postApi.get<unknown>(`/posts?${usp.toString()}`);

  // Unwrap { status, data } if your backend wraps responses
  const payload = isEnvelope(resp.data) ? resp.data.data : resp.data;

  // ✅ Runtime validation + type inference
  const parsed = PostsPageSchema.parse(payload);
  return parsed;
}
