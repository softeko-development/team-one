import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-3 bg-zinc-50 px-6 text-center dark:bg-black">
      <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
        Welcome to the Team One project
      </h1>
      <p className="text-lg text-zinc-600 dark:text-zinc-400">
        Read INSTRUCTIONS.md to get started.
      </p>
      <Link
        href="/posts"
        className="mt-3 rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950"
      >
        Manage posts
      </Link>
    </main>
  );
}
