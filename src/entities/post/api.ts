// src\entities\post\api.ts

import { postApi } from "@nihil_frontend/api/api";
import {
  PostDTOSchema,
  PostsPageSchema,
  type PostDTO,
  type PostsPage,
} from "@nihil_frontend/entities/post/schemas";
import { unwrapData } from "@nihil_frontend/shared/api/unwrap";

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

  const resp = await postApi.get<unknown>(`/posts?${usp.toString()}`);
  return PostsPageSchema.parse(unwrapData(resp.data));
}

export async function fetchAllPosts(): Promise<PostDTO[]> {
  const resp = await postApi.get<unknown>("/posts");
  return PostDTOSchema.array().parse(unwrapData(resp.data));
}
