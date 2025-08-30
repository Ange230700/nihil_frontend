// src\entities\user\schemas.ts

import { z } from "zod";

export const UserDTOSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.email(),
  displayName: z.string().optional(),
  avatarUrl: z.url().optional(),
});
export type UserDTO = z.infer<typeof UserDTOSchema>;

export const UsersPageSchema = z.object({
  items: z.array(UserDTOSchema),
  nextCursor: z.string().nullable(),
});
export type UsersPage = z.infer<typeof UsersPageSchema>;
