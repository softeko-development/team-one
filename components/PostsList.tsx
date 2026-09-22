"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { ApiError, deletePost, getPosts } from "@/lib/api";
import PostForm from "@/components/PostForm";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Post, PostsResponse } from "@/lib/type";

const LIMIT = 10;

function statusLabel(value: string | null) {
  if (value === "true") {
    return "Published";
  }

  if (value === "false") {
    return "Unpublished";
  }

  return "All";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function PostsList() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [data, setData] = useState<PostsResponse | null>(null);
  const [error, setError] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(searchParams.get("new") === "true");
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [searchText, setSearchText] = useState(searchParams.get("search") ?? "");

  const page = Number(searchParams.get("page") ?? "1") || 1;
  const published = searchParams.get("published");
  const search = searchParams.get("search") ?? "";
  const shouldOpenCreate = searchParams.get("new") === "true";

  const queryKey = useMemo(
    () => `${page}:${search}:${published ?? ""}`,
    [page, published, search],
  );

  const setQuery = useCallback(
    (updates: Record<string, string | null>) => {
      const next = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          next.set(key, value);
        } else {
          next.delete(key);
        }
      });

      const query = next.toString();
      router.push(query ? `${pathname}?${query}` : pathname);
    },
    [pathname, router, searchParams],
  );

  useEffect(() => {
    setSearchText(search);
  }, [search]);

  useEffect(() => {
    if (shouldOpenCreate) {
      setIsCreateOpen(true);
    }
  }, [shouldOpenCreate]);

  useEffect(() => {
    let ignore = false;
    setError("");

    getPosts({ page, limit: LIMIT, search, published: published ?? undefined })
      .then((postsData) => {
        if (!ignore) {
          setData(postsData);
        }
      })
      .catch((fetchError) => {
        if (!ignore) {
          setError(
            fetchError instanceof ApiError
              ? fetchError.message
              : "Unable to load posts. Please try again.",
          );
        }
      });

    return () => {
      ignore = true;
    };
  }, [queryKey, page, published, search]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (searchText !== search) {
        setQuery({ search: searchText.trim() || null, page: null });
      }
    }, 350);

    return () => window.clearTimeout(timeout);
  }, [searchText, search, setQuery]);

  function handleDelete(post: Post) {
    const confirmed = window.confirm(`Delete "${post.title}"? This cannot be undone.`);

    if (!confirmed) {
      return;
    }

    startTransition(async () => {
      try {
        await deletePost(post.slug);
        const refreshed = await getPosts({
          page,
          limit: LIMIT,
          search,
          published: published ?? undefined,
        });
        setData(refreshed);
        router.refresh();
      } catch (deleteError) {
        setError(
          deleteError instanceof ApiError
            ? deleteError.message
            : "Unable to delete this post. Please try again.",
        );
      }
    });
  }

  async function refreshPosts() {
    const refreshed = await getPosts({
      page,
      limit: LIMIT,
      search,
      published: published ?? undefined,
    });
    setData(refreshed);
  }

  const posts = data?.posts ?? [];
  const isLoading = !data && !error;
  const totalPages = data?.totalPages ?? 1;
  const isPostModalOpen = isCreateOpen || editingPost !== null;

  function closePostModal() {
    setIsCreateOpen(false);
    setEditingPost(null);

    if (shouldOpenCreate) {
      setQuery({ new: null });
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 border-b border-zinc-200 pb-5 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
          <Input
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Search by title"
            className="flex-1"
          />
          <select
            value={published ?? ""}
            onChange={(event) =>
              setQuery({ published: event.target.value || null, page: null })
            }
            className="min-h-10 rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none ring-zinc-900/10 focus:border-zinc-500 focus:ring-4"
            aria-label="Publication status"
          >
            <option value="">All</option>
            <option value="true">Published</option>
            <option value="false">Unpublished</option>
          </select>
        </div>
        <Button
          type="button"
          onClick={() => {
            setIsCreateOpen(true);
          }}
          className="w-full md:w-auto"
        >
          New post
        </Button>
      </div>

      <Dialog
        open={isPostModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            closePostModal();
          }
        }}
        title={editingPost ? "Edit post" : "New post"}
        description={
          editingPost
            ? "Update this post and keep its slug, content, and status in sync."
            : "Create a post and publish it now or save it as unpublished."
        }
      >
        <PostForm
          key={editingPost?.id ?? "new-post"}
          post={editingPost ?? undefined}
          onCancel={closePostModal}
          onSuccess={(post) => {
            closePostModal();
            refreshPosts().catch(() => {
              setError("Post saved, but the list could not refresh.");
            });
            router.push(`/posts/${post.slug}`);
          }}
        />
      </Dialog>

      <div className="flex items-center justify-between text-sm text-zinc-600">
        <span>
          {data ? `${data.total} posts` : "Loading posts"} · {statusLabel(published)}
        </span>
        <span>Page {page}</span>
      </div>

      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {isLoading ? (
        <div className="rounded-md border border-zinc-200 bg-white p-8 text-center text-sm text-zinc-600">
          Loading posts...
        </div>
      ) : null}

      {!isLoading && !error && posts.length === 0 ? (
        <div className="rounded-md border border-zinc-200 bg-white p-8 text-center">
          <p className="font-medium text-zinc-900">No posts found.</p>
          <p className="mt-1 text-sm text-zinc-600">Try a different search or status filter.</p>
        </div>
      ) : null}

      {posts.length > 0 ? (
        <div className="overflow-hidden rounded-md border border-zinc-200 bg-white">
          <div className="divide-y divide-zinc-200">
            {posts.map((post) => (
              <article key={post.id} className="grid gap-4 p-4 md:grid-cols-[1fr_auto]">
                <Link href={`/posts/${post.slug}`} className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="truncate text-base font-semibold text-zinc-950">
                      {post.title}
                    </h2>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        post.published
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {post.published ? "Published" : "Unpublished"}
                    </span>
                  </div>
                  <p className="mt-1 font-mono text-xs text-zinc-500">/{post.slug}</p>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-600">
                    {post.content}
                  </p>
                  <p className="mt-3 text-xs text-zinc-500">Updated {formatDate(post.updatedAt)}</p>
                </Link>
                <div className="flex items-start gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditingPost(post)}
                    className="min-h-0 px-3 py-2"
                  >
                    Edit
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => handleDelete(post)}
                    disabled={isPending}
                    className="min-h-0 px-3 py-2"
                  >
                    Delete
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </div>
      ) : null}

      <div className="flex items-center justify-between gap-3">
        <Button
          type="button"
          variant="outline"
          disabled={page <= 1}
          onClick={() => setQuery({ page: String(page - 1) })}
        >
          Previous
        </Button>
        <span className="text-sm text-zinc-600">
          Page {page} of {totalPages}
        </span>
        <Button
          type="button"
          variant="outline"
          disabled={page >= totalPages}
          onClick={() => setQuery({ page: String(page + 1) })}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
