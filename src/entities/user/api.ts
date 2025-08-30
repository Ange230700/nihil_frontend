// src\entities\user\api.ts

import { userApi } from "@nihil_frontend/api/api";
import {
  UserDTOSchema,
  UsersPageSchema,
  type UserDTO,
  type UsersPage,
} from "@nihil_frontend/entities/user/schemas";
import { unwrapData } from "@nihil_frontend/shared/api/unwrap";

export async function fetchUsers(params: {
  limit: number;
  cursor?: string | null;
  q?: string;
}): Promise<UsersPage> {
  const usp = new URLSearchParams();
  usp.set("limit", String(params.limit));
  if (params.cursor) usp.set("cursor", params.cursor);
  if (params.q) usp.set("q", params.q);

  const resp = await userApi.get<unknown>(`/users?${usp.toString()}`);
  return UsersPageSchema.parse(unwrapData(resp.data));
}

export async function fetchAllUsers(): Promise<UserDTO[]> {
  const res = await userApi.get<unknown>("/users");
  return UserDTOSchema.array().parse(unwrapData(res.data));
}

export async function createUser(input: {
  username: string;
  email: string;
  password: string;
}): Promise<UserDTO> {
  const res = await userApi.post<unknown>("/users", input);
  return UserDTOSchema.parse(unwrapData(res.data));
}
