import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import prisma from "./lib/prisma";
import { Lucia, User, Session } from "lucia";
import { cache } from "react";
import { cookies } from "next/headers";

//适配器 使用prisma.session, prisma.user中的两个模型
const adapter = new PrismaAdapter(prisma.session, prisma.user);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    // 设置过期时间为不过期
    expires: false,
    attributes: {
      // secure字段用于指定cookies只能通过 https 来发送
      secure: process.env.NODE_ENV === "production",
    },
  },
  //调用数据 lucia内部会自动调用
  getUserAttributes(databaseUserAttributes) {
    return {
      id: databaseUserAttributes.id,
      username: databaseUserAttributes.username,
      displayName: databaseUserAttributes.displayName,
      avatarUrl: databaseUserAttributes.avatarUrl,
      googleId: databaseUserAttributes.googleId,
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  googleId: string | null;
}

//      这里缓存了一个函数，使我们只在第一次调用时真正向服务器发送请求，后面的调用都是返回内存中的值
export const validateRequest = cache(
  async (): Promise<
    { user: User; session: Session } | { user: null; session: null }
  > => {
    // 获取会话id
    const sessionId =
      (await cookies()).get(lucia.sessionCookieName)?.value ?? null;

    if (!sessionId) {
      return {
        user: null,
        session: null,
      };
    }

    // 返回值result 包含用户信息和会话信息  lucia自动返回数据库中的数据
    const result = await lucia.validateSession(sessionId);

    try {
      // 如果存在session 则刷新session
      if (result.session && result.session.fresh) {
        const sessionCookie = lucia.createSessionCookie(result.session.id);
        (await cookies()).set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );
      }
      //   如果没有session 则清除客户端cookies
      if (!result.session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        (await cookies()).set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );
      }
    } catch {}

    // 返回用户的数据 session,user之类
    return result;
  }
);
