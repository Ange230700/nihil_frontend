// src\pages\Home.tsx

import PostCreateForm from "@nihil_frontend/features/posts/PostCreateForm";
import PostList from "@nihil_frontend/features/posts/PostList";
import UserCreateForm from "@nihil_frontend/features/users/UserCreateForm";
import UserList from "@nihil_frontend/features/users/UserList";
import { useState } from "react";

export default function Home() {
  const [userRefresh, setUserRefresh] = useState(0);
  const [postRefresh, setPostRefresh] = useState(0);

  return (
    <section className="mx-auto mt-4 flex max-w-2xl flex-col gap-8">
      <div>
        <h1 className="mb-2 text-2xl font-bold">Users</h1>
        <UserCreateForm
          onCreated={() => {
            setUserRefresh((r) => r + 1);
          }}
        />
        <div className="my-4" />
        <UserList key={userRefresh} />
      </div>
      <div>
        <h1 className="mb-2 text-2xl font-bold">Posts</h1>
        <PostCreateForm
          onCreated={() => {
            setPostRefresh((r) => r + 1);
          }}
        />
        <div className="my-4" />
        <PostList key={postRefresh} />
      </div>
    </section>
  );
}
