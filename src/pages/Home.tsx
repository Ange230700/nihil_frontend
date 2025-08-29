// src\pages\Home.tsx

import PostCreateForm from "@nihil_frontend/features/posts/PostCreateForm";
import PostList from "@nihil_frontend/features/posts/PostList";
import UserCreateForm from "@nihil_frontend/features/users/UserCreateForm";
import UserList from "@nihil_frontend/features/users/UserList";
// import { useIntl, FormattedMessage } from "react-intl";
// import { lazyWithPreload } from "@nihil_frontend/shared/lazy";
// import { usePrefetchOnVisible } from "@nihil_frontend/shared/prefetch";

export default function Home() {
  // const intl = useIntl();
  return (
    <section className="mx-auto mt-4 flex max-w-2xl flex-col gap-8">
      <div>
        <h1 className="mb-2 text-2xl font-bold">Users</h1>
        <UserCreateForm />
        <div className="my-4" />
        <UserList />
      </div>

      <div>
        <h1 className="mb-2 text-2xl font-bold">Posts</h1>
        <PostCreateForm />
        <div className="my-4" />
        <PostList />
      </div>
    </section>
  );
}
