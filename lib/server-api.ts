import { headers } from "next/headers";
import "server-only";
import { ApiError, Post } from "@/lib/api";

async function serverUrl(path: string) {
  const configuredUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (configuredUrl) {
    return `${configuredUrl.replace(/\/$/, "")}${path}`;
  }

  const requestHeaders = await headers();
  const host = requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "http";

  return `${protocol}://${host}${path}`;
}

export async function getPostOnServer(slug: string) {
  let response: Response;

  try {
    response = await fetch(await serverUrl(`/api/posts/${encodeURIComponent(slug)}`), {
      next: { revalidate: 60, tags: [`post:${slug}`, "posts"] },
    });
  } catch {
    throw new ApiError("Unable to reach the post service. Please try again.", 0);
  }

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new ApiError("Unable to load this post. Please try again.", response.status);
  }

  return (await response.json()) as Post;
}
