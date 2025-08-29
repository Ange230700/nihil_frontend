// src\entities\user\validation.ts

import { z } from "zod";

export const UserCreateSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters"),
  email: z.email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
export type UserCreateInput = z.infer<typeof UserCreateSchema>;
