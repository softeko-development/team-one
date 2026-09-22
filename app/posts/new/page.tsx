import PostForm from "../PostForm";

export default function NewPostPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-10">
      <h1 className="mb-6 text-3xl font-semibold">Create post</h1>
      <PostForm />
    </main>
  );
}
