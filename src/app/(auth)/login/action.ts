"use server";

import { lucia } from "@/auth";
import prisma from "@/lib/prisma";
import { loginSchema, LoginValue } from "@/lib/validation";
import { verify } from "@node-rs/argon2";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(
  credentials: LoginValue
): Promise<{ error: string }> {
  try {
    // 验证参数
    const { username, password } = loginSchema.parse(credentials);

    // 查询         查询用对应字段，添加用 $transaction
    const existingUser = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
    });
    if (!existingUser || !existingUser.passwordHash) {
      return {
        error: "Invalid email or password",
      };
    }

    // 验证密码
    const validPassword = await verify(existingUser.passwordHash, password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });
    if (!validPassword) {
      return {
        error: "Invalid email or password",
      };
    }

    // 设置cookies
    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookies = lucia.createSessionCookie(session.id);
    (await cookies()).set(
      sessionCookies.name,
      sessionCookies.value,
      sessionCookies.attributes
    );

    //
    return redirect("/");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return { error: "something went wrong" };
  }
}
