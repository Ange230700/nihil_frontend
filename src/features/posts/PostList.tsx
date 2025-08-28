// src\features\posts\PostList.tsx

import { useCallback, useEffect, useState } from "react";
import { postApi } from "@nihil_frontend/api/api";
import Spinner from "@nihil_frontend/components/Spinner";
import StateCard from "@nihil_frontend/components/StateCard";

interface PostDTO {
  id: string;
  userId: string;
  content: string;
  mediaUrl?: string | null;
  createdAt?: string;
}

export default function PostList() {
  const [posts, setPosts] = useState<PostDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback((): void => {
    setError(null);
    setLoading(true);

    postApi
      .get<{ status: string; data: PostDTO[] }>("/posts")
      .then((res) => {
        setPosts(res.data.data);
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
        setPosts([]);
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
        title="Couldn’t load posts"
        description={error}
        icon="pi pi-cloud-off"
        onRetry={load}
        retryLabel="Retry"
      />
    );

  if (!posts.length)
    return (
      <StateCard
        title="No posts yet"
        description="Create the first post to see it here."
        icon="pi pi-comments"
        onRetry={load}
        retryLabel="Refresh"
      />
    );

  return (
    <div>
      <h2 className="mb-2 text-lg font-bold">Posts</h2>
      <ul className="divide-y">
        {posts.map((post) => (
          <li key={post.id} className="py-2">
            <div>{post.content}</div>
            {post.createdAt ? (
              <div className="text-xs text-gray-400">{post.createdAt}</div>
            ) : null}
          </li>
        ))}
      </ul>
      <div className="mt-3">
        <button type="button" className="text-sm underline" onClick={load}>
          Refresh
        </button>
      </div>
    </div>
  );
}
