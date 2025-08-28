// src\features\users\UserList.tsx

// src/features/users/UserList.tsx
import { useEffect, useState } from "react";
import { userApi } from "@nihil_frontend/api/api";
import SkeletonList from "@nihil_frontend/components/SkeletonList";
import { getErrorMessage } from "@nihil_frontend/shared/errors/getErrorMessage";

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

  useEffect(() => {
    setError(null);
    setLoading(true);
    userApi
      .get<{ data: UserDTO[] }>("/users")
      .then((res) => {
        setUsers(res.data.data);
      })
      .catch((err: unknown) => {
        setError(getErrorMessage(err));
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div aria-live="polite">
        <h2 className="mb-2 text-lg font-bold">Users</h2>
        <SkeletonList rows={6} withAvatar aria-label="Loading users" />
      </div>
    );

  if (error)
    return (
      <div className="text-red-500" role="alert">
        {error}
      </div>
    );

  if (!users.length) return <div>No users found.</div>;

  return (
    <div>
      <h2 className="mb-2 text-lg font-bold">Users</h2>
      <ul className="divide-y">
        {users.map((user) => (
          <li key={user.id} className="flex items-center gap-2 py-2">
            {user.avatarUrl && (
              <img
                src={user.avatarUrl}
                alt={user.username}
                className="h-8 w-8 rounded-full"
              />
            )}
            <div>
              <div className="font-semibold">{user.username}</div>
              <div className="text-sm text-gray-500">{user.email}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
