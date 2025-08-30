// src\entities\user\hooks.ts

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchUsers } from "@nihil_frontend/entities/user/api";
import type { UsersPage } from "@nihil_frontend/entities/user/schemas";

export function useUsers(params: {
  limit: number;
  cursor?: string | null;
  q?: string;
}) {
  return useQuery<UsersPage>({
    queryKey: ["users", params],
    queryFn: () => fetchUsers(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}
