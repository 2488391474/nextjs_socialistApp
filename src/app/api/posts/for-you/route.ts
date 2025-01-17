import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getPostDataInclude, postDataInclude, PostsPage } from "@/lib/types";
import { NextRequest } from "next/server";

// react query操作流程
// 1 创建API 如下
// 2 const query = useQuery<PostData[]>( 使用api
export async function GET(req: NextRequest) {
  try {
    //                        cursor 即光标
    //                    从url中提取cursor 用于实现分页逻辑
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;
    const pageSize = 10;
    const { user } = await validateRequest();
    if (!user) {
      // 返回值
      return Response.json({ error: "Unauthrize" }, { status: 401 });
    }

    const posts = await prisma.post.findMany({
      include: getPostDataInclude(user.id),
      orderBy: { createAt: "desc" },
      // 查询记录比分页大于一条，多出来的一条用于确定是否有下一页
      take: pageSize + 1,
      // 如果传入了curosr参数，则查询从cursor对应的记录开始，否则从头开始
      //              从对应的id开始
      cursor: cursor ? { id: cursor } : undefined,
    });

    //                  计算下一页的cursor，有下一页则拿下一页的第一条数据的id来当cursor
    const nextCursor = posts.length > pageSize ? posts[pageSize].id : null;

    // 响应数据应该返回下一页的cursor，和当前页的数据
    const data: PostsPage = {
      // 取10个数据
      posts: posts.slice(0, pageSize),
      nextCursor: nextCursor,
    };

    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Interval server error" }, { status: 500 });
  }
}
