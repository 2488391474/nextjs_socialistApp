"use server";

import { SignUpValues } from "@/lib/validation";
import { signUpSchema } from "../../../lib/validation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import prisma from "@/lib/prisma";
import { hash } from "@node-rs/argon2";
import { generateIdFromEntropySize } from "lucia";
import { lucia } from "@/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
export async function signUp(
  credentials: SignUpValues
): Promise<{ error: string }> {
  try {
    //  总之就是分步走
    // 1验证参数
    // 2 检查用户名，emai等是否被占用
    // 3 添加到数据库
    // 4 添加cookies

    // 服务端验证参数  防止用户跳过认证直接向服务端发送包含非法参数的请求
    const { email, username, password } = signUpSchema.parse(credentials);

    const existingUsername = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
    });
    if (existingUsername) {
      return {
        error: "Username already taken",
      };
    }

    const existingEmail = await prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
    });
    if (existingEmail) {
      return {
        error: "Email already taken",
      };
    }

    // 加密密码 初始化用户id
    const passwordHash = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });
    const userId = generateIdFromEntropySize(10);

    // 写入数据库
    await prisma.$transaction(async (tx) => {
      await tx.user.create({
        data: {
          id: userId,
          username,
          displayName: username,
          email,
          passwordHash,
        },
      });
    });
    // 用lucia生成cookie 因为lucia将在数据库中的session存储
    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    (await cookies()).set(
      // cookies 的名字
      sessionCookie.name,
      //   cookie的值，通常是加密会话的id
      sessionCookie.value,
      //   额外信息，如expires secure httponly 等信息
      sessionCookie.attributes
    );

    return redirect("/");
  } catch (error) {
    // 如果是重定向错误，那么将跳转到error界面
    if (isRedirectError(error)) throw error;
    console.error(error);
    return { error: "Something went wrong. Please try again." };
  }
}
