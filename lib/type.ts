import { z } from "zod";

export type Post = {
  id: string;
  title: string;
  slug: string;
  content: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

export const postFormSchema = z.object({
  title: z.string().trim().min(1, "Title is required."),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and single hyphens only."),
  content: z.string().trim().min(1, "Content is required."),
  published: z.boolean(),
});

export type PostPayload = z.infer<typeof postFormSchema>;

export type PostsResponse = {
  posts: Post[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};
