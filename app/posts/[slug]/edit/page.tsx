import Link from "next/link";
import { notFound } from "next/navigation";
import PostForm from "@/components/PostForm";
import { ApiError } from "@/lib/api";
import { getPostOnServer } from "@/lib/server-api";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function EditPostPage({ params }: PageProps) {
  const { slug } = await params;

  try {
    const post = await getPostOnServer(slug);

    if (!post) {
      notFound();
    }

    return (
      <main className="min-h-screen bg-zinc-50 px-4 py-8 text-zinc-950 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <Link
            href={`/posts/${post.slug}`}
            className="text-sm font-medium text-zinc-600 hover:text-zinc-950"
          >
            Back to post
          </Link>
          <h1 className="mt-6 text-3xl font-semibold tracking-tight">Edit post</h1>
          <div className="mt-8 rounded-md border border-zinc-200 bg-white p-6">
            <PostForm post={post} />
          </div>
        </div>
      </main>
    );
  } catch (error) {
    if (error instanceof ApiError) {
      return (
        <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 text-zinc-950">
          <div className="max-w-md rounded-md border border-red-200 bg-red-50 p-6 text-center">
            <h1 className="text-lg font-semibold text-red-900">Unable to load post</h1>
            <p className="mt-2 text-sm leading-6 text-red-700">{error.message}</p>
            <Link
              href="/posts"
              className="mt-5 inline-flex rounded-md bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800"
            >
              Back to posts
            </Link>
          </div>
        </main>
      );
    }

    throw error;
  }
}
