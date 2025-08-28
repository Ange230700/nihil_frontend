// src\routes\HomeRoute.tsx

import { Suspense } from "react";
import { Await } from "react-router";
import {
  Form,
  useLoaderData,
  useNavigation,
  isRouteErrorResponse,
  useRouteError,
} from "react-router-dom";
import { Skeleton } from "primereact/skeleton";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

export interface UserDTO {
  id: string;
  username: string;
  email: string;
}
export interface PostDTO {
  id: string;
  userId: string;
  content: string;
  createdAt?: string;
}

export interface HomeDeferData {
  users: Promise<UserDTO[]>;
  posts: Promise<PostDTO[]>;
}

export default function HomeRoute() {
  const data: HomeDeferData = useLoaderData();
  const nav = useNavigation();
  const isSubmitting = nav.state === "submitting";

  return (
    <section className="mx-auto mt-4 flex max-w-2xl flex-col gap-8">
      <div>
        <h1 className="mb-2 text-2xl font-bold">Users</h1>

        {/* create user via action */}
        <Form method="post" className="flex items-end gap-2">
          <input type="hidden" name="intent" value="createUser" />
          <span>
            <label className="block text-sm">
              Username
              <InputText name="username" required />
            </label>
          </span>
          <span>
            <label className="block text-sm">
              Email
              <InputText name="email" required />
            </label>
          </span>
          <span>
            <label className="block text-sm">
              Password
              <InputText name="password" type="password" required />
            </label>
          </span>
          <Button
            type="submit"
            label={isSubmitting ? "Adding..." : "Add"}
            disabled={isSubmitting}
          />
        </Form>

        <div className="my-4" />

        <Suspense fallback={<ListSkeleton prefix="users" />}>
          <Await
            resolve={data.users}
            errorElement={<InlineError scope="users" />}
          >
            {(users: UserDTO[]) =>
              users.length ? (
                <ul className="divide-y">
                  {users.map((u) => (
                    <li key={u.id} className="py-2">
                      <div className="font-semibold">{u.username}</div>
                      <div className="text-sm text-gray-500">{u.email}</div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div>No users found.</div>
              )
            }
          </Await>
        </Suspense>
      </div>

      <div>
        <h1 className="mb-2 text-2xl font-bold">Posts</h1>

        {/* create post via action */}
        <Form method="post" className="flex items-end gap-2">
          <input type="hidden" name="intent" value="createPost" />
          <span>
            <label className="block text-sm">
              User ID
              <InputText name="userId" required />
            </label>
          </span>
          <span>
            <label className="block text-sm">
              Content
              <InputText name="content" required />
            </label>
          </span>
          <Button
            type="submit"
            label={isSubmitting ? "Posting..." : "Post"}
            disabled={isSubmitting}
          />
        </Form>

        <div className="my-4" />

        <Suspense fallback={<ListSkeleton prefix="posts" />}>
          <Await
            resolve={data.posts}
            errorElement={<InlineError scope="posts" />}
          >
            {(posts: PostDTO[]) =>
              posts.length ? (
                <ul className="divide-y">
                  {posts.map((p) => (
                    <li key={p.id} className="py-2">
                      <div>{p.content}</div>
                      <div className="text-xs text-gray-400">{p.createdAt}</div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div>No posts yet.</div>
              )
            }
          </Await>
        </Suspense>
      </div>
    </section>
  );
}

/** ---- Error boundary for the route (loader/action errors) ---- */
export function HomeErrorBoundary() {
  const err = useRouteError();
  if (isRouteErrorResponse(err)) {
    return (
      <div className="mx-auto max-w-xl p-4">
        <h2 className="mb-2 text-xl font-bold">Error {err.status}</h2>
        <p>{(err.data as { message: string }).message}</p>
      </div>
    );
  }
  const msg = err instanceof Error ? err.message : "Something went wrong.";
  return (
    <div className="mx-auto max-w-xl p-4">
      <h2 className="mb-2 text-xl font-bold">Unexpected Error</h2>
      <p>{msg}</p>
    </div>
  );
}

/** ---- Reusable list skeleton (no index-as-key) ---- */
function ListSkeleton({
  rows = 6,
  prefix = "row",
}: Readonly<{
  rows?: number;
  prefix?: string;
}>) {
  // Build stable keys once per prop set; map over the string keys (not indices)
  const keys = Array.from(
    { length: rows },
    (_, i) => `${prefix}-${String(i + 1)}`,
  );
  return (
    <div className="space-y-2">
      {keys.map((k) => (
        <Skeleton key={k} height="2rem" />
      ))}
    </div>
  );
}

function InlineError({ scope }: Readonly<{ scope: "users" | "posts" }>) {
  return (
    <div className="text-red-500">Failed to load {scope}. Try reloading.</div>
  );
}
