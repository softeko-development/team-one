import Link from "next/link";

export default function PostNotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 text-zinc-950">
      <div className="max-w-md text-center">
        <p className="text-sm font-medium text-zinc-500">404</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Post not found</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-600">
          The post may have been deleted, unpublished, or moved to another slug.
        </p>
        <Link
          href="/posts"
          className="mt-6 inline-flex rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Back to posts
        </Link>
      </div>
    </main>
  );
}
