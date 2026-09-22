import Link from "next/link";
import PostForm from "@/components/PostForm";

export const metadata = {
  title: "New post",
};

export default function NewPostPage() {
  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-8 text-zinc-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Link href="/posts" className="text-sm font-medium text-zinc-600 hover:text-zinc-950">
          Back to posts
        </Link>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight">New post</h1>
        <div className="mt-8 rounded-md border border-zinc-200 bg-white p-6">
          <PostForm />
        </div>
      </div>
    </main>
  );
}
