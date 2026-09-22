import { createPostService } from "./service";

export async function createPostController(req: Request) {
  try {
    const body = await req.json();

    const { title, slug, content, published } = body;

    if (!title || !slug || !content) {
      return Response.json(
        { error: "title, slug and content are required" },
        { status: 400 }
      );
    }

    const post = await createPostService({
      title,
      slug,
      content,
      published,
    });

    return Response.json(
      { success: true, data: post },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create post error:", error);

    return Response.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}