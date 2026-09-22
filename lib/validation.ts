export type PostInput = {
  title: string;
  slug: string;
  content: string;
  published: boolean;
};

export type ValidationResult =
  | {
      success: true;
      data: PostInput;
    }
  | {
      success: false;
      errors: string[];
    };

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function validatePostInput(input: unknown): ValidationResult {
  const body = input as Partial<Record<keyof PostInput, unknown>>;
  const errors: string[] = [];

  const title = typeof body.title === "string" ? body.title.trim() : "";
  const slug = typeof body.slug === "string" ? body.slug.trim().toLowerCase() : "";
  const content = typeof body.content === "string" ? body.content.trim() : "";
  const published =
    typeof body.published === "boolean" ? body.published : false;

  if (!title) {
    errors.push("Title is required.");
  }

  if (title.length > 120) {
    errors.push("Title must be 120 characters or less.");
  }

  if (!slug) {
    errors.push("Slug is required.");
  } else if (!slugPattern.test(slug)) {
    errors.push("Slug can only use lowercase letters, numbers, and hyphens.");
  }

  if (!content) {
    errors.push("Content is required.");
  }

  if (content.length > 10000) {
    errors.push("Content must be 10,000 characters or less.");
  }

  if (body.published !== undefined && typeof body.published !== "boolean") {
    errors.push("Published must be true or false.");
  }

  if (errors.length > 0) {
    return {
      success: false,
      errors,
    };
  }

  return {
    success: true,
    data: {
      title,
      slug,
      content,
      published,
    },
  };
}
