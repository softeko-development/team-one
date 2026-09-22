"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";
import { ApiError, createPost, Post, PostPayload, updatePost } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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

export default function PostForm({
  post,
  onCancel,
  onSuccess,
}: {
  post?: Post;
  onCancel?: () => void;
  onSuccess?: (post: Post) => void;
}) {
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
    console.log("Post form submit:", values);

    const errors = validatePost(values);
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      console.warn("Post form validation errors:", errors);
      setFormError("Please fix the highlighted fields.");
      return;
    }

    startTransition(async () => {
      try {
        console.log("Post form sending request:", post ? "update" : "create");

        const savedPost = post
          ? await updatePost(post.slug, values)
          : await createPost(values);

        console.log("Post form response:", savedPost);

        onSuccess?.(savedPost);

        if (!onSuccess) {
          router.push(`/posts/${savedPost.slug}`);
        }

        router.refresh();
      } catch (error) {
        console.error("Post form error:", error);

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
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={values.title}
          onChange={(event) => updateValue("title", event.target.value)}
        />
        {fieldErrors.title ? <p className="text-sm text-red-600">{fieldErrors.title}</p> : null}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          value={values.slug}
          onChange={(event) => updateValue("slug", event.target.value)}
          className="font-mono"
        />
        {fieldErrors.slug ? <p className="text-sm text-red-600">{fieldErrors.slug}</p> : null}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          value={values.content}
          onChange={(event) => updateValue("content", event.target.value)}
          rows={12}
        />
        {fieldErrors.content ? (
          <p className="text-sm text-red-600">{fieldErrors.content}</p>
        ) : null}
      </div>

      <Label className="flex items-center gap-3">
        <Checkbox
          checked={values.published}
          onChange={(event) => updateValue("published", event.target.checked)}
        />
        Published
      </Label>

      <div className="flex flex-wrap gap-3">
        <Button
          type="submit"
          disabled={isPending}
        >
          {isPending ? "Saving..." : post ? "Save changes" : "Create post"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            if (onCancel) {
              onCancel();
              return;
            }

            router.back();
          }}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
