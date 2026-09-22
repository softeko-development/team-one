"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";
import { ApiError, createPost, Post, PostPayload, updatePost } from "@/lib/api";

type FieldErrors = Partial<Record<keyof PostPayload, string>>;

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function validatePost(values: PostPayload) {
  const errors: FieldErrors = {};

  if (!values.title.trim()) {
    errors.title = "Title is required.";
  }

  if (!values.slug.trim()) {
    errors.slug = "Slug is required.";
  } else if (!slugPattern.test(values.slug)) {
    errors.slug = "Use lowercase letters, numbers, and single hyphens only.";
  }

  if (!values.content.trim()) {
    errors.content = "Content is required.";
  }

  return errors;
}

export default function PostForm({ post }: { post?: Post }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [values, setValues] = useState<PostPayload>({
    title: post?.title ?? "",
    slug: post?.slug ?? "",
    content: post?.content ?? "",
    published: post?.published ?? false,
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");

  function updateValue<K extends keyof PostPayload>(key: K, value: PostPayload[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    setFieldErrors((current) => ({ ...current, [key]: undefined }));
    setFormError("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const errors = validatePost(values);
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      setFormError("Please fix the highlighted fields.");
      return;
    }

    startTransition(async () => {
      try {
        const savedPost = post
          ? await updatePost(post.slug, values)
          : await createPost(values);

        router.push(`/posts/${savedPost.slug}`);
        router.refresh();
      } catch (error) {
        if (error instanceof ApiError) {
          setFormError(error.message);
          setFieldErrors(error.fieldErrors as FieldErrors);
          return;
        }

        setFormError("Something went wrong while saving this post.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {formError ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {formError}
        </div>
      ) : null}

      <div className="grid gap-2">
        <label htmlFor="title" className="text-sm font-medium text-zinc-800">
          Title
        </label>
        <input
          id="title"
          value={values.title}
          onChange={(event) => updateValue("title", event.target.value)}
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none ring-zinc-900/10 focus:border-zinc-500 focus:ring-4"
        />
        {fieldErrors.title ? <p className="text-sm text-red-600">{fieldErrors.title}</p> : null}
      </div>

      <div className="grid gap-2">
        <label htmlFor="slug" className="text-sm font-medium text-zinc-800">
          Slug
        </label>
        <input
          id="slug"
          value={values.slug}
          onChange={(event) => updateValue("slug", event.target.value)}
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 font-mono text-sm outline-none ring-zinc-900/10 focus:border-zinc-500 focus:ring-4"
        />
        {fieldErrors.slug ? <p className="text-sm text-red-600">{fieldErrors.slug}</p> : null}
      </div>

      <div className="grid gap-2">
        <label htmlFor="content" className="text-sm font-medium text-zinc-800">
          Content
        </label>
        <textarea
          id="content"
          value={values.content}
          onChange={(event) => updateValue("content", event.target.value)}
          rows={12}
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm leading-6 outline-none ring-zinc-900/10 focus:border-zinc-500 focus:ring-4"
        />
        {fieldErrors.content ? (
          <p className="text-sm text-red-600">{fieldErrors.content}</p>
        ) : null}
      </div>

      <label className="flex items-center gap-3 text-sm font-medium text-zinc-800">
        <input
          type="checkbox"
          checked={values.published}
          onChange={(event) => updateValue("published", event.target.checked)}
          className="size-4 rounded border-zinc-300"
        />
        Published
      </label>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
        >
          {isPending ? "Saving..." : post ? "Save changes" : "Create post"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-100"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
