import { createPostController } from "./controller";

export async function POST(req: Request) {
  return createPostController(req);
}