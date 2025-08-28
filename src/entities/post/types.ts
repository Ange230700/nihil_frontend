// src\entities\post\types.ts

export interface PostDTO {
  id: string;
  userId: string;
  content: string;
  mediaUrl?: string | null;
  createdAt?: string;
}

export interface PostsPage {
  items: PostDTO[];
  nextCursor: string | null;
}
