"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getPostDataInclude, postDataInclude } from "@/lib/types";

//actions 负责后端操作
export async function deletePost(id: string) {
  // 1检查是否登录
  const { user } = await validateRequest();
  if (!user) {
    return new Error("Unauthorized");
  }
  // 2 通过id找到该文章 orm操作别忘记判断是否操作失败
  const post = await prisma.post.findUnique({
    where: {
      id,
    },
  });
  if (!post) throw new Error("Post not found");

  // 3 判断是否使自己的文章
  if (post.id !== user.id) {
    return new Error("Unauthorized");
  }

  // 4 执行删除文章操作
  const deletePost = await prisma.post.delete({
    where: {
      id,
    },
    include: getPostDataInclude(user.id),
  });
  return deletePost;
}
