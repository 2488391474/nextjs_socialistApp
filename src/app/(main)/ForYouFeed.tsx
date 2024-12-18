"use client";

import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import DeletePostDialog from "@/components/posts/DeletePostDialog";
import Post from "@/components/posts/Post";
import PostsLoadingSkeleton from "@/components/posts/PostLoadingSkeleton";
import kyInstance from "@/lib/ky";
import { PostsPage } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import React from "react";

const ForYouFeed = () => {
  // 发送请求，
  // const query = useQuery<PostData[]>({
  // 查询的唯一标识，当其他地方使用相同的querKey时，react Query会直接返回缓存的数据 而不是重新请求
  // 在这里post-feed作为主键  for-you用来区分不同查询
  // queryKey: ["post-feed", "for-you"],
  // 查询函数
  // 不使用ky之前
  // queryFn: async () => {
  //   const res = await fetch("/api/posts/for-you");
  //   if (!res.ok) {
  //     throw Error(`requset failed with status code:${res.status}`);
  //   }
  //   return res.json();
  // },

  // 使用ky之后:
  // queryFn: kyInstance.get("/api/posts/for-you").json<PostData[]>,
  // });

  // ---------------------------------------------------------------------------------------------
  // 获取数据 展示数据
  // 主要的操作就是获取数据,然后根据数据来进行各种渲染
  const {
    data,
    status,
    fetchNextPage, //加载下一页
    hasNextPage, //是否还有更多页
    isFetching, //是否正在加载下一页数据
    isFetchingNextPage, //是否正在加载下一页数据
  } = useInfiniteQuery({
    queryKey: ["post-feed", "for-you"],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          "/api/posts/for-you",
          pageParam ? { searchParams: { cursor: pageParam } } : {}
        )
        // 返回数据设置为PostsPage，这里设置之后 后面就可以自动获取到类型
        .json<PostsPage>(),
    // 设置分页查询的初始化参数
    initialPageParam: null as string | null,
    // 从api返回的数据中提取出下一页的参数，并设置为下一页的参数
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  // 将所有数据扁平为一个数组
  const posts = data?.pages.flatMap((page) => page.posts) || [];

  // 第一次加载时 还在加载时显示骨架屏
  if (status === "pending") {
    return <PostsLoadingSkeleton />;
  }
  // 没有数据且没有下一页时，显示空页面
  if (status === "success" && !posts.length && !hasNextPage) {
    return (
      <p className="text-center text-muted-foreground">
        no one has posted anything yet.
      </p>
    );
  }

  if (status === "error") {
    return (
      <p className="text-center text-destructive">
        An error occurred while loding posts.
      </p>
    );
  }
  return (
    //使用无限滚动的组件
    <InfiniteScrollContainer
      className="space-y-5"
      // 当滚动到一定距离调用这个传递的api 传递获取下一页数据的api
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
      {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
    </InfiniteScrollContainer>
  );
};

export default ForYouFeed;
