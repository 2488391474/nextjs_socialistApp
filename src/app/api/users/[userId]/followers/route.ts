import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { FollowerInfo } from "@/lib/types";
import { use } from "react";

//获取指定用户的粉丝数量 与是否已经关注
export async function GET(
  req: Request,
  { params: { userId } }: { params: { userId: string } }
) {
  try {
    const { user: loggedInUser } = await validateRequest();
    if (!loggedInUser) {
      return Response.json({ error: "Unauthrize" }, { status: 401 });
    }

    //                              查询唯一的用户记录
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        // 筛选出当前用户是否已经关注该用户(通过followerId 来匹配)
        followers: {
          where: {
            followerId: loggedInUser.id,
          },
          select: {
            followerId: true,
          },
        },
        // 计算该用户的粉丝的数量
        _count: {
          select: {
            followers: true,
          },
        },
      },
    });

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }
    const data: FollowerInfo = {
      followers: user._count.followers, //返回该用户的粉丝数量
      isFollowedByUser: !!user.followers.length, //用户是否已经关注该用户
    };

    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Interval server error" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params: { userId } }: { params: { userId: string } }
) {
  try {
    const { user: loggedInUser } = await validateRequest();
    if (!loggedInUser) {
      return Response.json({ error: "Unauthrize" }, { status: 401 });
    }

    // upsert方法 可以在数据库中插入新数据，或者在记录存在时更新
    await prisma.follow.upsert({
      where: {
        followerId_followingId: {
          followerId: loggedInUser.id,
          followingId: userId,
        },
      },
      create: {
        followerId: loggedInUser.id,
        followingId: userId,
      },
      update: {},
    });
    return new Response();
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Interval server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params: { userId } }: { params: { userId: string } }
) {
  try {
    const { user: loggedInUser } = await validateRequest();
    if (!loggedInUser) {
      return Response.json({ error: "Unauthrize" }, { status: 401 });
    }

    //为了保证数据不会因为唯一性的问题而出现取消关注失败，因此这里使用deleteMany删除所有相同的
    await prisma.follow.deleteMany({
      where: {
        followerId: loggedInUser.id,
        followingId: userId,
      },
    });
    return new Response()

  } catch (error) {
    console.error(error);
    return Response.json({ error: "Interval server error" }, { status: 500 });
  }
}
