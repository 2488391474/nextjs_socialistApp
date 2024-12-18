import { useToast } from "@/hooks/use-toast";
import {
  InfiniteData,
  QueryClient,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { deletePost } from "./actions";
import { PostsPage } from "@/lib/types";
import { usePathname, useRouter } from "next/navigation";

// mutations突变负责与前端操作
export function useDeletePostMutation() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const router = useRouter();

  //执行突变
  const mutation = useMutation({
    mutationFn: deletePost,
    onSuccess: async (deletedPost) => {
      const queryFilter = { queryKey: ["post-feed"] };

      // 1取消旧数据缓存
      queryClient.cancelQueries(queryFilter);

      // 2筛选新数据并设置
      queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
        queryFilter,
        // 这个回调被传入被删除成功的post
        (oldData) => {
          if (!oldData) return;

          //   返回筛选过后的数据
          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              nextCursor: page.nextCursor,
              posts: page.posts.filter((p) => p.id !== deletedPost.id),
            })),
          };
        }
      );

      //   3 提示用户并且跳转界面
      toast({
        description: "Post deleted",
      });

      if (pathname === `/post/${deletedPost.id}`) {
        router.push(`/users/${deletePost.user.username}`);
      }
    },
    onError: (error) => {
      console.error(error);

      toast({
        variant: "destructive",
        description: "Failed to delete post.Please try again.",
      });
    },
  });

  return mutation;
}
