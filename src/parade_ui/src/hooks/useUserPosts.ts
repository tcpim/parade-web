import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { useMainServer } from "./useMainServer";
import {
  GetUserPostsRequest,
  GetUserPostsResponse,
  UserPostCreatedTsKey,
} from "../../backend_declarations/main_server/main_server.did";

const PAGE_SIZE = 20;
const getFetchRequest = (
  userPid: string,
  cursor: [UserPostCreatedTsKey]
): GetUserPostsRequest => {
  return {
    user_id: userPid,
    cursor: cursor,
    limit: [PAGE_SIZE],
  };
};

export const useUserPosts = (userPid: string) => {
  const mainServer = useMainServer();

  const userPostsQuery = useInfiniteQuery<GetUserPostsResponse, Error>({
    queryKey: ["userPosts", userPid],
    queryFn: async ({ pageParam = [] }) => {
      const request = getFetchRequest(userPid, pageParam);
      const response = await mainServer.get_posts_by_user(request);
      return response;
    },
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.next_cursor.length === 0) {
        return undefined;
      } else {
        return lastPage.next_cursor;
      }
    },
    //staleTime: 1000 * 60,
    keepPreviousData: true,
  });

  return userPostsQuery;
};
