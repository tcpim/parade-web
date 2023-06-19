import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import {
  GetUserPostsRequest,
  UserPostCreatedTsKey,
} from "../../../backend_declarations/main_server/main_server.did";
import { Post } from "../../types/post";
import { DEFAULT_PAGE_SIZE_FOR_FEED } from "../../utils/constants";
import { useMainServer } from "../useMainServer";
import { getPostFromPostTypes } from "./helper";

interface UserPostsPage {
  posts: Array<Post>;
  next_cursor: [UserPostCreatedTsKey] | [];
}

const getFetchRequest = (
  userPid: string,
  cursor: [UserPostCreatedTsKey] | [],
  limit: number
): GetUserPostsRequest => {
  return {
    user_id: userPid,
    cursor: cursor,
    limit: [limit],
  };
};

export const useUserPosts = (userPid: string) => {
  const mainServer = useMainServer();
  const queryClient = useQueryClient();

  const queryFunction = async (
    cursor: [UserPostCreatedTsKey] | []
  ): Promise<UserPostsPage> => {
    const len = DEFAULT_PAGE_SIZE_FOR_FEED;
    const request = getFetchRequest(userPid, cursor, len);
    const userPosts = await mainServer.get_posts_by_user(request);
    const next_cursor = userPosts.next_cursor;

    const posts = await getPostFromPostTypes(len, userPosts.posts, queryClient);

    const result: UserPostsPage = {
      posts: posts,
      next_cursor: next_cursor,
    };
    return result;
  };

  const userPostsQuery = useInfiniteQuery<UserPostsPage, Error>({
    queryKey: ["userPosts", userPid],
    queryFn: ({ pageParam = [] }) => queryFunction(pageParam),
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
