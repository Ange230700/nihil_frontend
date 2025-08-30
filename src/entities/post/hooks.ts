// src\entities\post\hooks.ts

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchPosts } from "@nihil_frontend/entities/post/api";
import type { PostsPage } from "@nihil_frontend/entities/post/schemas";

export function usePosts(params: {
  limit: number;
  cursor?: string | null;
  q?: string;
  userId?: string;
}) {
  return useQuery<PostsPage>({
    queryKey: ["posts", params],
    queryFn: () => fetchPosts(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}
