import Link from "next/link";

export default function PostNotFound() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-10">
      <h1 className="text-3xl font-semibold">Post not found</h1>
      <p className="mt-3 text-zinc-600">
        The post you are looking for does not exist.
      </p>
      <Link href="/posts" className="mt-6 inline-block text-blue-600">
        Back to posts
      </Link>
    </main>
  );
}
