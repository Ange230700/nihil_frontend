// src\entities\post\schemas.ts

import { z } from "zod";

export const PostDTOSchema = z.object({
  id: z.string(),
  userId: z.string(),
  content: z.string(),
  mediaUrl: z.string().nullable().optional(),
  createdAt: z.string().optional(),
});

export const PostsPageSchema = z.object({
  items: z.array(PostDTOSchema),
  nextCursor: z.string().nullable(),
});

// ✅ Types stay in lockstep with the schema
export type PostDTO = z.infer<typeof PostDTOSchema>;
export type PostsPage = z.infer<typeof PostsPageSchema>;
