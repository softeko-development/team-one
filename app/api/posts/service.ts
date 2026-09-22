import prisma from "@/lib/prisma";

type CreatePostInput = {
  title: string;
  slug: string;
  content: string;
  published?: boolean;
};

export async function createPostService(data: CreatePostInput) {
  return await prisma.post.create({
    data: {
      title: data.title,
      slug: data.slug,
      content: data.content,
      published: data.published ?? false,
    },
  });
}