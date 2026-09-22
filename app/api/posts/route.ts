import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@/app/generated/prisma/client";
import prisma from "@/lib/prisma";
import { validatePostInput } from "@/lib/validation";

export async function GET() {
  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(posts);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = validatePostInput(body);

  if (!validation.success) {
    return NextResponse.json(
      { message: "Please fix the errors below.", errors: validation.errors },
      { status: 400 },
    );
  }

  try {
    const post = await prisma.post.create({
      data: validation.data,
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { message: "Slug already exists.", errors: ["Slug already exists."] },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { message: "Something went wrong while creating the post." },
      { status: 500 },
    );
  }
}
