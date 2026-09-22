import { Post, PostPayload, PostsResponse } from "@/lib/type";
export type { Post, PostPayload, PostsResponse } from "@/lib/type";

type ApiErrorPayload = {
  message?: string;
  error?: string;
  errors?: Record<string, string | string[]>;
};

export class ApiError extends Error {
  status: number;
  fieldErrors: Record<string, string>;

  constructor(message: string, status: number, fieldErrors: Record<string, string> = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

function apiUrl(path: string) {
  if (!API_BASE_URL) {
    return path;
  }

  return `${API_BASE_URL.replace(/\/$/, "")}${path}`;
}

function normalizeFieldErrors(errors: ApiErrorPayload["errors"]) {
  if (!errors) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(errors).map(([field, value]) => [
      field,
      Array.isArray(value) ? value.join(" ") : value,
    ]),
  );
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  const url = apiUrl(path);

  try {
    console.log("API request:", init?.method ?? "GET", url, init?.body ?? null);

    response = await fetch(url, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...init?.headers,
      },
    });
  } catch {
    console.error("API network error:", init?.method ?? "GET", url);
    throw new ApiError("Unable to reach the post service. Please try again.", 0);
  }

  console.log("API response status:", response.status, response.statusText, url);

  if (!response.ok) {
    let payload: ApiErrorPayload = {};

    try {
      payload = (await response.json()) as ApiErrorPayload;
    } catch {
      // Some APIs return an empty body for failures.
    }

    console.error("API error response:", response.status, payload);

    const message =
      payload.message ??
      payload.error ??
      (response.status === 409
        ? "A post with this slug already exists."
        : "The post service returned an error. Please try again.");

    throw new ApiError(message, response.status, normalizeFieldErrors(payload.errors));
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();

  console.log("API response body:", text);

  if (!text) {
    return undefined as T;
  }

  return JSON.parse(text) as T;
}

export function getPosts(params: {
  page?: number;
  limit?: number;
  search?: string;
  published?: string;
}) {
  const query = new URLSearchParams();
  query.set("page", String(params.page ?? 1));
  query.set("limit", String(params.limit ?? 10));

  if (params.search) {
    query.set("search", params.search);
  }

  if (params.published === "true" || params.published === "false") {
    query.set("published", params.published);
  }

  return request<PostsResponse>(`/api/posts?${query.toString()}`, {
    cache: "no-store",
  });
}

export function getPost(slug: string) {
  return request<Post>(`/api/posts/${encodeURIComponent(slug)}`, {
    next: { revalidate: 60, tags: [`post:${slug}`, "posts"] },
  });
}

export function createPost(payload: PostPayload) {
  return request<Post>("/api/posts", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updatePost(slug: string, payload: PostPayload) {
  return request<Post>(`/api/posts/${encodeURIComponent(slug)}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deletePost(slug: string) {
  await request<unknown>(`/api/posts/${encodeURIComponent(slug)}`, {
    method: "DELETE",
  });
}
