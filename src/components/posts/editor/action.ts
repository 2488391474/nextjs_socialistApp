"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getPostDataInclude, postDataInclude } from "@/lib/types";
import { createPostSchema } from "@/lib/validation";

export async function submitPost(input: { content: string }) {
  const { user } = await validateRequest();
  if (!user) throw new Error("Unauthrize");

  const { content } = createPostSchema.parse(input);

  if (!content) throw new Error("Content is required");

  const newPost = await prisma.post.create({
    data: {
      content: content as string,
      userId: user.id,
    },
    include: getPostDataInclude(user.id),
  });

  return newPost;
}
