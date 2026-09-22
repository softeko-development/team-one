import { Suspense } from "react";
import PostsList from "@/components/PostsList";

export const metadata = {
  title: "Posts",
};

export default function PostsPage() {
  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-8 text-zinc-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">Posts</h1>
          <p className="text-sm text-zinc-600">Manage published and draft posts.</p>
        </div>
        <Suspense
          fallback={
            <div className="rounded-md border border-zinc-200 bg-white p-8 text-center text-sm text-zinc-600">
              Loading posts...
            </div>
          }
        >
          <PostsList />
        </Suspense>
      </div>
    </main>
  );
}
