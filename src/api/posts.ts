// src\api\posts.ts

import { postApi } from "@nihil_frontend/api/api";

export interface PostDTO {
  id: string;
  userId: string;
  content: string;
  mediaUrl?: string | null;
  createdAt?: string;
}

export async function fetchPosts(): Promise<PostDTO[]> {
  const res = await postApi.get<{ status: string; data: PostDTO[] }>("/posts");
  return res.data.data;
}

export async function createPost(data: {
  userId: string;
  content: string;
}): Promise<PostDTO> {
  const res = await postApi.post<{ status: string; data: PostDTO }>(
    "/posts",
    data,
  );
  return res.data.data;
}
