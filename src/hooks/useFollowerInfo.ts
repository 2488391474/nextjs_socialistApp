import kyInstance from "@/lib/ky";
import { FollowerInfo } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

export default function useFollowerInfo(
  userId: string,
  initialState: FollowerInfo
) {
  const query = useQuery({
    queryKey: ["follower-info", userId],
    queryFn: () => kyInstance.get(`/users/${userId}/followers`).json(),
    initialData: initialState,
    staleTime: Infinity,
  });
  return query;
}
