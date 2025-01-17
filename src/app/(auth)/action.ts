"use server";

import { redirect } from "next/navigation";
import { lucia, validateRequest } from "../../auth";
import { cookies } from "next/headers";
export async function logout() {
  const { session } = await validateRequest();

  if (!session) {
    throw new Error("Not logged in");
  }

  //   删除数据库中的session，使当前会话无效
  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();

  //   退出其实就是设置空cookie
  (await cookies()).set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  return redirect("/login");
}
