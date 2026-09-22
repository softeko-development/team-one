"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type PostFormProps = {
  initialPost?: {
    title: string;
    slug: string;
    content: string;
    published: boolean;
  };
  submitUrl?: string;
  method?: "POST" | "PUT";
};

type ApiError = {
  message?: string;
  errors?: string[];
};

export default function PostForm({
  initialPost,
  submitUrl = "/api/posts",
  method = "POST",
}: PostFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialPost?.title ?? "");
  const [slug, setSlug] = useState(initialPost?.slug ?? "");
  const [content, setContent] = useState(initialPost?.content ?? "");
  const [published, setPublished] = useState(initialPost?.published ?? false);
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors([]);
    setIsSubmitting(true);

    const response = await fetch(submitUrl, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        slug,
        content,
        published,
      }),
    });

    const data = (await response.json()) as ApiError & { slug?: string };

    setIsSubmitting(false);

    if (!response.ok) {
      setErrors(data.errors ?? [data.message ?? "Something went wrong."]);
      return;
    }

    router.push(`/posts/${data.slug ?? slug}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {errors.length > 0 && (
        <div className="rounded border border-red-300 bg-red-50 p-4 text-red-800">
          <p className="font-semibold">Please fix these errors:</p>
          <ul className="mt-2 list-disc pl-5">
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <label className="block">
        <span className="text-sm font-medium">Title</span>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="mt-1 w-full rounded border border-zinc-300 px-3 py-2"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium">Slug</span>
        <input
          value={slug}
          onChange={(event) => setSlug(event.target.value)}
          className="mt-1 w-full rounded border border-zinc-300 px-3 py-2"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium">Content</span>
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          className="mt-1 min-h-48 w-full rounded border border-zinc-300 px-3 py-2"
        />
      </label>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={published}
          onChange={(event) => setPublished(event.target.checked)}
        />
        <span>Published</span>
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded bg-black px-4 py-2 font-medium text-white disabled:opacity-60"
      >
        {isSubmitting ? "Saving..." : "Save post"}
      </button>
    </form>
  );
}
