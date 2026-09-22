import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";

type SinglePostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function SinglePostPage({ params }: SinglePostPageProps) {
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
      <div className="mb-6 flex items-center justify-between gap-4">
        <Link href="/posts" className="text-sm text-zinc-600 hover:text-black">
          Back to posts
        </Link>
        <Link
          href={`/posts/${post.slug}/edit`}
          className="rounded border border-zinc-300 px-3 py-2 text-sm font-medium hover:bg-zinc-50"
        >
          Edit
        </Link>
      </div>

      <h1 className="text-3xl font-semibold">{post.title}</h1>
      <p className="mt-2 text-sm text-zinc-500">
        {post.published ? "Published" : "Unpublished"}
      </p>
      <article className="mt-8 whitespace-pre-wrap text-zinc-800">
        {post.content}
      </article>
    </main>
  );
}
