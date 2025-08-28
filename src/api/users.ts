// src\api\users.ts

import { userApi } from "@nihil_frontend/api/api";

export interface UserDTO {
  id: string;
  username: string;
  email: string;
  displayName?: string;
  avatarUrl?: string;
}

export async function fetchUsers(): Promise<UserDTO[]> {
  const res = await userApi.get<{ data: UserDTO[] }>("/users");
  return res.data.data;
}

export async function createUser(data: {
  username: string;
  email: string;
  password: string;
}): Promise<UserDTO> {
  const res = await userApi.post<{ data: UserDTO }>("/users", data);
  return res.data.data;
}
