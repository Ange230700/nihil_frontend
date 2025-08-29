// src\entities\post\validation.ts

import { z } from "zod";

export const PostCreateSchema = z.object({
  // if your user ids aren't UUIDs, replace .uuid() with .min(1)
  userId: z.uuid("Invalid user id"),
  content: z.string().min(1, "Content is required").max(5000, "Too long"),
});
export type PostCreateInput = z.infer<typeof PostCreateSchema>;
