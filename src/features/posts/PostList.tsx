// src\features\posts\PostList.tsx

import { useQuery } from "@tanstack/react-query";
import Spinner from "@nihil_frontend/components/Spinner";
import StateCard from "@nihil_frontend/components/StateCard";
import { fetchAllPosts } from "@nihil_frontend/entities/post/api";

export default function PostList() {
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["posts", "listAll"],
    queryFn: fetchAllPosts,
    staleTime: 30_000,
  });

  if (isLoading) return <Spinner />;

  if (isError)
    return (
      <StateCard
        title="Couldn’t load posts"
        description={error instanceof Error ? error.message : "Request failed"}
        icon="pi pi-cloud-off"
        onRetry={() => void refetch()}
        retryLabel="Retry"
      />
    );

  const posts = data ?? [];
  if (!posts.length)
    return (
      <StateCard
        title="No posts yet"
        description="Create the first post to see it here."
        icon="pi pi-comments"
        onRetry={() => void refetch()}
        retryLabel="Refresh"
      />
    );

  return (
    <div style={{ opacity: isFetching ? 0.7 : 1 }}>
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
