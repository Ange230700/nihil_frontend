// src\features\users\UserList.tsx

import { useEffect, useState } from "react";
import { userApi } from "@nihil_frontend/api/api";
import Spinner from "@nihil_frontend/components/Spinner";

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

  useEffect(() => {
    userApi
      .get<{ data: UserDTO[] }>("/users")
      .then((res) => {
        setUsers(res.data.data);
      })
      .catch((err: unknown) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <Spinner />;
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
