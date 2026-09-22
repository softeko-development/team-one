import Link from "next/link";
import { notFound } from "next/navigation";
import { ApiError } from "@/lib/api";
import { getPostOnServer } from "@/lib/server-api";

type PageProps = {
  params: Promise<{ slug: string }>;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;

  try {
    const post = await getPostOnServer(slug);

    if (!post) {
      notFound();
    }

    return (
      <main className="min-h-screen bg-zinc-50 px-4 py-8 text-zinc-950 sm:px-6 lg:px-8">
        <article className="mx-auto max-w-3xl">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
            <Link href="/posts" className="text-sm font-medium text-zinc-600 hover:text-zinc-950">
              Back to posts
            </Link>
            <Link
              href={`/posts/${post.slug}/edit`}
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium hover:bg-zinc-100"
            >
              Edit
            </Link>
          </div>

          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                post.published ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
              }`}
            >
              {post.published ? "Published" : "Unpublished"}
            </span>
            <span className="font-mono text-xs text-zinc-500">/{post.slug}</span>
          </div>

          <h1 className="text-4xl font-semibold tracking-tight">{post.title}</h1>
          <dl className="mt-5 grid gap-2 text-sm text-zinc-600 sm:grid-cols-2">
            <div>
              <dt className="font-medium text-zinc-900">Created</dt>
              <dd>{formatDate(post.createdAt)}</dd>
            </div>
            <div>
              <dt className="font-medium text-zinc-900">Updated</dt>
              <dd>{formatDate(post.updatedAt)}</dd>
            </div>
          </dl>

          <div className="mt-8 whitespace-pre-wrap rounded-md border border-zinc-200 bg-white p-6 text-base leading-7 text-zinc-800">
            {post.content}
          </div>
        </article>
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
