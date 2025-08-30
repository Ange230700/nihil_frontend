// src\tests\msw\fixtures\users.ts

export interface User {
  id: string;
  username: string;
  email: string;
  displayName?: string;
  avatarUrl?: string;
}

export const USERS: User[] = Array.from({ length: 42 }, (_, i) => ({
  id: `u${String(i + 1).padStart(2, "0")}`,
  username: `user_${String(i + 1).padStart(2, "0")}`,
  email: `user_${String(i + 1).padStart(2, "0")}@example.com`,
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
    ? USERS.filter(
        (u) =>
          u.username.toLowerCase().includes(norm) ||
          u.email.toLowerCase().includes(norm),
      )
    : USERS;

  const items = filtered.slice(offset, offset + limit);
  const nextCursor =
    offset + limit < filtered.length ? String(offset + limit) : null;

  return { items, nextCursor };
}
