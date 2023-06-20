import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import {
  GetUserPostsRequest,
  UserPostCreatedTsKey,
} from "../../../backend_declarations/main_server/main_server.did";
import { Post } from "../../types/post";
import { DEFAULT_PAGE_SIZE_FOR_FEED } from "../../utils/constants";
import { useMainServer } from "../useMainServer";
import { useGetPostFromPostTypes } from "./useGetPostFromPostTypes";

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
  const getPosts = useGetPostFromPostTypes();

  const queryFunction = useCallback(
    async (cursor: [UserPostCreatedTsKey] | []): Promise<UserPostsPage> => {
      const len = DEFAULT_PAGE_SIZE_FOR_FEED;
      const request = getFetchRequest(userPid, cursor, len);
      const userPosts = await mainServer.get_posts_by_user(request);
      const posts = await getPosts(len, userPosts.posts);

      const result: UserPostsPage = {
        posts: posts,
        next_cursor: userPosts.next_cursor,
      };
      return result;
    },
    [getPosts]
  );

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
