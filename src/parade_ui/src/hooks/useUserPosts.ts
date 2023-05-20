import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { useMainServer } from "./useMainServer";
import {
  GetPostByUserRequest,
  PostList,
} from "../../backend_declarations/main_server/main_server.did";

const PAGE_SIZE = 20;
const getFetchRequest = (
  userPid: string,
  offset: number
): GetPostByUserRequest => {
  return {
    user: userPid,
    offset: offset,
    limit: [PAGE_SIZE],
  };
};

export const useUserPosts = (userPid: string) => {
  const mainServer = useMainServer();

  const userPostsQuery = useInfiniteQuery<PostList, Error>({
    queryKey: ["userPosts", userPid],
    queryFn: async ({ pageParam = 0 }) => {
      const request = getFetchRequest(userPid, pageParam);
      const response = await mainServer.get_posts_by_user(request);
      return response;
    },
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.posts.length < PAGE_SIZE) {
        return undefined;
      } else {
        return lastPage.offset;
      }
    },
    //staleTime: 1000 * 60,
    keepPreviousData: true,
  });

  return userPostsQuery;
};
