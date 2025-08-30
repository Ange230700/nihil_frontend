// src\entities\post\schemas.ts

import { z } from "zod";

export const PostDTOSchema = z.object({
  id: z.string(),
  userId: z.string(),
  content: z.string(),
  mediaUrl: z.string().nullable().optional(),
  createdAt: z.string().optional(),
});
export type PostDTO = z.infer<typeof PostDTOSchema>;

export const PostsPageSchema = z.object({
  items: z.array(PostDTOSchema),
  nextCursor: z.string().nullable(),
});
export type PostsPage = z.infer<typeof PostsPageSchema>;
