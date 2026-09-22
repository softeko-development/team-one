import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import PostForm from "../../PostForm";

type EditPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { slug } = await params;

  const post = await prisma.post.findUnique({
    where: {
      slug,
    },
  });

  if (!post) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-10">
      <h1 className="mb-6 text-3xl font-semibold">Edit post</h1>
      <PostForm
        initialPost={post}
        submitUrl={`/api/posts/${post.slug}`}
        method="PUT"
      />
    </main>
  );
}
