// src\entities\user\schemas.ts

import { z } from "zod";

export const UserDTOSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.email(),
  displayName: z.string().optional(),
  avatarUrl: z.url().optional(),
});
export const UsersSchema = z.array(UserDTOSchema);
export const UserCreateSchema = z.object({
  username: z.string().min(3).max(30),
  email: z.email(),
  password: z.string().min(8),
});
export const UsersPageSchema = z.object({
  items: z.array(UserDTOSchema),
  nextCursor: z.string().nullable(),
});

export type UserDTO = z.infer<typeof UserDTOSchema>;
export type UsersPage = z.infer<typeof UsersPageSchema>;
export type UserCreateInput = z.infer<typeof UserCreateSchema>;
