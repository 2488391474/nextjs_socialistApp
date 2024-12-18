"use client";

import useFollowerInfo from "@/hooks/useFollowerInfo";
import kyInstance from "@/lib/ky";
import { FollowerInfo } from "@/lib/types";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";

interface FollowButtonProps {
  userId: string;
  initialState: FollowerInfo;
}

export default function FollowButton({
  userId,
  initialState,
}: FollowButtonProps) {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  //获取有没有关注这个关注者，与该关注者的粉丝数量
  const { data } = useFollowerInfo(userId, initialState);

  const queryKey: QueryKey = ["follower-info", userId];

  const { mutate,isSuccess } = useMutation({
    mutationFn: () =>
      //关注了则是删除关注，没关注则是添加关注
      data.isFollowedByUser
        ? kyInstance.delete(`/api/users/${userId}/followers`)
        : kyInstance.post(`/api/users/${userId}/followers`),
    //这里使用onMutate，在请求发送前，先取消之前的查询，并获取之前的数据
    // 实现乐观更新的效果
    onMutate: async () => {
      // 作用：确保在 mutation 期间，任何与 queryKey 相关的查询操作都被暂停。
      // 目的：防止并发查询或更新与本次 mutation 冲突，从而避免数据不一致。
      //这个函数是取消正在进行的查询 而非删除查询
      await queryClient.cancelQueries({ queryKey });

      //获取旧的数据 用于回滚
      const previousState = queryClient.getQueryData<FollowerInfo>(queryKey);

      //更新queryKey的缓存信息
      //这里返回了一个新的对象，所以跟旧的对象不关联了，所以更改新对象不会影响到旧的对象，因此旧数据不会因为该操作而被更改
      queryClient.setQueryData<FollowerInfo>(queryKey, () => ({
        followers:
          //更新信息
          (previousState?.followers || 0) +
          (previousState?.isFollowedByUser ? -1 : 1),
        isFollowedByUser: !previousState?.isFollowedByUser,
      }));
      console.log(previousState, "previousState");

      //返回旧数据
      return { previousState };
    },
    //            当更新失败时   回滚数据，这里的context是在onMutate中返回的
    onError(error, variables, context) {
      //                          回滚数据
      if(!isSuccess){
        queryClient.setQueryData(queryKey, context?.previousState);
      }
      
      console.error(error);
      toast({
        variant: "destructive",
        description: "Something went wrong. Please try again.",
      });
    },
  });

  return (
    // 展示数据
    <Button
      variant={data.isFollowedByUser ? "secondary" : "default"}
      onClick={() => mutate()}
    >
      {data.isFollowedByUser ? "Unfollow" : "Follow"}
    </Button>
  );
}
