// src\tests\msw\fixtures\posts.ts

export interface Post {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
}

export const POSTS: Post[] = Array.from({ length: 50 }, (_, i) => ({
  id: `p${String(i + 1).padStart(2, "0")}`,
  userId: `u${String((i % 5) + 1)}`,
  content: `Post #${String(i + 1).padStart(2, "0")}`,
  createdAt: new Date(2025, 0, 1, i).toISOString(),
}));

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
