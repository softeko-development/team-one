"use client";

import { FormEvent, useState } from "react";

export default function Home() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const res = await fetch("http://localhost:3000/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        slug,
        content,
        published: true,
      }),
    });

    const data = await res.json();
    console.log(data);
    alert("Post created");
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12, maxWidth: 500, margin: "40px auto" }}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />
      <input
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        placeholder="Slug"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Content"
      />
      <button type="submit">Create Post</button>
    </form>
  );
}