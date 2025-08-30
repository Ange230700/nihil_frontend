// src\features\users\UserList.tsx

import { useQuery } from "@tanstack/react-query";
import Spinner from "@nihil_frontend/components/Spinner";
import StateCard from "@nihil_frontend/components/StateCard";
import Img from "@nihil_frontend/components/Img";
import { fetchAllUsers } from "@nihil_frontend/entities/user/api";

export default function UserList() {
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["users", "list"],
    queryFn: fetchAllUsers,
    staleTime: 30_000,
  });

  if (isLoading) return <Spinner />;

  if (isError)
    return (
      <StateCard
        title="Couldn’t load users"
        description={error instanceof Error ? error.message : "Request failed"}
        icon="pi pi-cloud-off"
        onRetry={() => void refetch()}
        retryLabel="Retry"
      />
    );

  const users = data ?? [];
  if (!users.length)
    return (
      <StateCard
        title="No users yet"
        description="There are no users to show. Try creating one, then refresh."
        icon="pi pi-users"
        onRetry={() => void refetch()}
        retryLabel="Refresh"
      />
    );

  return (
    <div style={{ opacity: isFetching ? 0.7 : 1 }}>
      <h2 className="mb-2 text-lg font-bold">Users</h2>
      <ul className="divide-y">
        {users.map((user) => (
          <li key={user.id} className="flex items-center gap-2 py-2">
            {user.avatarUrl && (
              <div
                style={{ aspectRatio: "1 / 1" }}
                className="h-8 w-8 overflow-hidden rounded-full"
              >
                <Img
                  src={user.avatarUrl}
                  alt={user.username}
                  width={32}
                  height={32}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            <div>
              <div className="font-semibold">{user.username}</div>
              <div className="text-sm text-gray-500">{user.email}</div>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-3">
        <button
          type="button"
          className="text-sm underline"
          onClick={() => void refetch()}
        >
          Refresh
        </button>
      </div>
    </div>
  );
}
