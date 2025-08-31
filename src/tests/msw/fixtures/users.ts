// src\tests\msw\fixtures\users.ts

import { faker } from "@nihil_frontend/tests/utils/faker";

export interface User {
  id: string;
  username: string;
  email: string;
  displayName?: string;
  avatarUrl?: string;
}

export const USERS: User[] = Array.from({ length: 42 }, () => {
  const username = faker.internet.username().toLowerCase().replace(/\./g, "_");
  return {
    id: faker.string.uuid(),
    username,
    email: faker.internet
      .email({ firstName: username, provider: "example.com" })
      .toLowerCase(),
    displayName: faker.person.fullName(),
    avatarUrl: faker.image.avatar(),
  };
});

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

// Optional helper for user-search tests, if you add some later:
export const USERS_SEARCH_FIX = (() => {
  const index = 5;
  const target = USERS[index];
  const token = target.username.slice(0, 4); // short safe token
  return {
    index,
    token,
    expectedId: target.id,
    expectedUsername: target.username,
    expectedEmail: target.email,
  };
})();
