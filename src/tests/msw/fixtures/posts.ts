// src\tests\msw\fixtures\posts.ts

import { faker } from "@nihil_frontend/tests/utils/faker";

export interface Post {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
}

// Stable, increasing timestamps for predictable ordering
const START = new Date("2025-01-01T00:00:00.000Z");

export const POSTS: Post[] = Array.from({ length: 50 }, (_, i) => ({
  id: `p${String(i + 1).padStart(2, "0")}`,
  userId: `u${String((i % 5) + 1).padStart(2, "0")}`,
  // Realistic but deterministic content
  content: faker.lorem.sentence({ min: 3, max: 9 }),
  createdAt: new Date(START.getTime() + i * 60_000).toISOString(), // +1 min each
}));

/**
 * Simple, deterministic pagination & search by substring in content.
 */
export function querySlice(params: {
  q?: string | null;
  limit: number;
  cursor?: string | null;
}) {
  const { q, limit } = params;
  const offset = params.cursor ? Number(params.cursor) || 0 : 0;
  const norm = (q ?? "").toLowerCase();

  const filtered = norm
    ? POSTS.filter((p) => p.content.toLowerCase().includes(norm))
    : POSTS;

  const items = filtered.slice(offset, offset + limit);
  const nextCursor =
    offset + limit < filtered.length ? String(offset + limit) : null;

  return { items, nextCursor };
}

/**
 * Export a guaranteed search token + the matching post
 * (so tests don’t rely on hard-coded “Post #23”).
 */
export const POSTS_SEARCH_FIX = (() => {
  const index = 22; // 0-based => the 23rd post
  const target = POSTS[index];
  // Pick a safe token that surely exists in content
  const token = target.content.split(/\s+/)[0].replace(/[^\w]/g, "");
  return {
    index,
    token,
    expectedId: target.id,
    expectedContent: target.content,
  };
})();
