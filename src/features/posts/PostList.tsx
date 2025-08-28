// src\features\posts\PostList.tsx

import { useEffect, useState } from "react";
import { postApi } from "@nihil_frontend/api/api";
import Spinner from "@nihil_frontend/components/Spinner";
import { useToast } from "@nihil_frontend/contexts/ToastContext";
import { mapApiError } from "@nihil_frontend/shared/api/mapApiError";

interface PostDTO {
  id: string;
  userId: string;
  content: string;
  mediaUrl?: string | null;
  createdAt?: string;
}

export default function PostList() {
  const toast = useToast();
  const [posts, setPosts] = useState<PostDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    setLoading(true);
    postApi
      .get<{ status: string; data: PostDTO[] }>("/posts")
      .then((res) => {
        setPosts(res.data.data);
      })
      .catch((err: unknown) => {
        const { severity, summary, detail } = mapApiError(err);
        setError(detail);
        toast.show({ severity, summary, detail });
        setPosts([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [toast]);

  if (loading) return <Spinner />;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!posts.length) return <div>No posts yet.</div>;

  return (
    <div>
      <h2 className="mb-2 text-lg font-bold">Posts</h2>
      <ul className="divide-y">
        {posts.map((post) => (
          <li key={post.id} className="py-2">
            <div>{post.content}</div>
            <div className="text-xs text-gray-400">{post.createdAt}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
