import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@/app/generated/prisma/client";
import prisma from "@/lib/prisma";
import { validatePostInput } from "@/lib/validation";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(request: NextRequest, { params }: RouteContext) {
  const { slug } = await params;

  const post = await prisma.post.findUnique({
    where: {
      slug,
    },
  });

  if (!post) {
    return NextResponse.json(
      { message: "Post not found.", errors: ["Post not found."] },
      { status: 404 },
    );
  }

  return NextResponse.json(post);
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  const { slug } = await params;
  const body = await request.json();
  const validation = validatePostInput(body);

  if (!validation.success) {
    return NextResponse.json(
      { message: "Please fix the errors below.", errors: validation.errors },
      { status: 400 },
    );
  }

  try {
    const post = await prisma.post.update({
      where: {
        slug,
      },
      data: validation.data,
    });

    return NextResponse.json(post);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { message: "Post not found.", errors: ["Post not found."] },
        { status: 404 },
      );
    }

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
      { message: "Something went wrong while updating the post." },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  const { slug } = await params;

  try {
    await prisma.post.delete({
      where: {
        slug,
      },
    });

    return NextResponse.json({ message: "Post deleted successfully." });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { message: "Post not found.", errors: ["Post not found."] },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Something went wrong while deleting the post." },
      { status: 500 },
    );
  }
}
