// src\tests\msw\fixtures\posts.ts

import { faker } from "@nihil_frontend/tests/utils/faker";

export interface Post {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
}

// Stable reference date to keep runs deterministic with seeded faker
const REF_DATE = "2025-01-01T00:00:00.000Z";

// Create a small, stable pool of user UUIDs
const USER_IDS = Array.from({ length: 5 }, () => faker.string.uuid());

/**
 * Build ascending timestamps with fakerized gaps.
 * Because faker is seeded (via your utils), this stays deterministic.
 */
function buildAscendingIsoDates(count: number): string[] {
  let cursor = faker.date.past({ years: 0.1, refDate: REF_DATE }).getTime();
  const dates: string[] = [];

  for (let i = 0; i < count; i += 1) {
    // Add a random gap (10s to 3min) to keep order but vary spacing
    const delta = faker.number.int({ min: 10_000, max: 180_000 });
    cursor += delta;
    dates.push(new Date(cursor).toISOString());
  }

  return dates;
}

const CREATED_ATS = buildAscendingIsoDates(50);

export const POSTS: Post[] = Array.from({ length: 50 }, (_, i) => ({
  id: faker.string.uuid(), // fakerized UUID
  userId: USER_IDS[i % USER_IDS.length], // stable cycling across 5 UUIDs
  content: faker.lorem.sentence({ min: 3, max: 9 }), // deterministic with seeded faker
  createdAt: CREATED_ATS[i], // ascending, randomized gaps
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
