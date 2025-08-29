// src\features\users\UserList.tsx

import { useCallback, useEffect, useState } from "react";
import { userApi } from "@nihil_frontend/api/api";
import Spinner from "@nihil_frontend/components/Spinner";
import StateCard from "@nihil_frontend/components/StateCard";
import Img from "@nihil_frontend/components/Img";

interface UserDTO {
  id: string;
  username: string;
  email: string;
  displayName?: string;
  avatarUrl?: string;
}

export default function UserList() {
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback((): void => {
    setError(null);
    setLoading(true);

    userApi
      .get<{ data: UserDTO[] }>("/users")
      .then((res) => {
        setUsers(res.data.data);
      })
      .catch((e: unknown) => {
        let message = "Network error";
        if (e instanceof Error) {
          message = e.message;
        } else if (
          typeof e === "object" &&
          e !== null &&
          "message" in e &&
          typeof (e as { message?: unknown }).message === "string"
        ) {
          message = (e as { message: string }).message;
        }
        setUsers([]);
        setError(message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <Spinner />;

  if (error)
    return (
      <StateCard
        title="Couldn’t load users"
        description={error}
        icon="pi pi-cloud-off"
        onRetry={load}
        retryLabel="Retry"
      />
    );

  if (!users.length)
    return (
      <StateCard
        title="No users yet"
        description="There are no users to show. Try creating one, then refresh."
        icon="pi pi-users"
        onRetry={load}
        retryLabel="Refresh"
      />
    );

  return (
    <div>
      <h2 className="mb-2 text-lg font-bold">Users</h2>
      <ul className="divide-y">
        {users.map((user) => (
          <li key={user.id} className="flex items-center gap-2 py-2">
            {user.avatarUrl && (
              <div
                style={{ aspectRatio: "16 / 9" }}
                className="w-full overflow-hidden rounded-xl"
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
      {/* Optional manual refresh */}
      <div className="mt-3">
        <button type="button" className="text-sm underline" onClick={load}>
          Refresh
        </button>
      </div>
    </div>
  );
}
