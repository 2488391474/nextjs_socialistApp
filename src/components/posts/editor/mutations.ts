import { useToast } from "@/hooks/use-toast";
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { submitPost } from "./action";
import { PostsPage } from "@/lib/types";
import { useSession } from "@/app/(main)/SessionProvider";

export function useSubmitPostMutation() {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const { user } = useSession();

  //  数据类型为：{pages[],cursor}

  //   封装变更操作 返回执行异步操作的方法和状态
  const mutation = useMutation({
    mutationFn: submitPost,
    // 当成功更新会执行这个回调
    onSuccess: async (newPost) => {
      // 获取缓存信息
      const queryFilter = {
        queryKey: ["post-feed", "for-you"],
        predicate(query) {
          return (
            query.queryKey.includes("for-you") ||
            (query.queryKey.includes("user-posts") &&
              query.queryKey.includes(user.id))
          );
        },

        //satisfies QueryFilters和直接告诉为QueryFilters的区别是，staisfies将保留字面量，不会将其变为QueryFilters类型
      } satisfies QueryFilters;
      // 取消缓存信息，防止用户在更新之后 页面继续使用过时的数据
      await queryClient.cancelQueries(queryFilter);

      // 旧新数据合并
      //   重新设置缓存信息 并且引发页面重新渲染
      queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
        queryFilter,
        (oldData) => {
          const firstPage = oldData?.pages[0];

          //   如果有旧数据的话 就将旧数据和新数据合并
          if (firstPage) {
            return {
              pageParams: oldData.pageParams,
              pages: [
                {
                  // 只对原先第一个页面进行添加数据
                  posts: [newPost, ...firstPage.posts],
                  nextCursor: firstPage.nextCursor,
                },
                // 返回旧数据的其他页面
                ...oldData.pages.slice(1),
              ],
            };
          }
        }
      );

      //  标记数据是否失效的函数，若失效会重新触发请求来拿取数据
      queryClient.invalidateQueries({
        queryKey: queryFilter.queryKey,

        // 满足条件的将缓存失效 即重新发起请求
        // 若predicate返回true,则为标记数据已经失效，即触发重新请求
        predicate(query) {
          // 有数据时返回false
          return queryFilter.predicate(query) && !query.state.data;
        },
      });

      toast({
        description: "Post created",
      });
    },
    onError(err) {
      console.error(err, "@@@");
      toast({
        variant: "destructive",
        description: "Failed to post.Please try again.",
      });
    },
  });

  return mutation;
}
