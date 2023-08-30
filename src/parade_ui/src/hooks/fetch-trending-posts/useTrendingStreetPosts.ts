import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import {
  GetTrendingStreetPostRequest,
  TrendingPostKey,
} from "../../../backend_declarations/main_server/main_server.did";
import { PostsPage } from "../../types/post";
import { DEFAULT_PAGE_SIZE_FOR_FEED } from "../../utils/constants";
import { useGetPostFromPostTypes } from "../fetch-posts/useGetPostFromPostTypes";
import { useMainServerActor } from "../server-connect/useMainServerActor";

const getFetchRequest = (
  cursor: [] | [TrendingPostKey],
  pageLimit: number
): GetTrendingStreetPostRequest => {
  return {
    cursor: cursor,
    limit: [pageLimit],
  };
};

export const useTrendingStreetPosts = (enabled = true) => {
  const mainServer = useMainServerActor();
  const getPosts = useGetPostFromPostTypes();

  const queryFunction = useCallback(
    async (
      cursor: [] | [TrendingPostKey]
    ): Promise<PostsPage<TrendingPostKey>> => {
      const len = DEFAULT_PAGE_SIZE_FOR_FEED;
      const request = getFetchRequest(cursor, len);
      const streetPosts = await mainServer.get_trending_street_posts(request);
      const posts = await getPosts(len, streetPosts.posts);

      const result: PostsPage<TrendingPostKey> = {
        posts: posts,
        next_cursor: streetPosts.next_cursor,
      };
      return result;
    },
    [getPosts]
  );

  const trendingStreetPostsQuery = useInfiniteQuery<
    PostsPage<TrendingPostKey>,
    Error
  >({
    queryKey: ["trendingStreetPosts"],
    queryFn: ({ pageParam = [] }) => queryFunction(pageParam),
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.next_cursor.length === 0) {
        return undefined;
      } else {
        return lastPage.next_cursor;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    keepPreviousData: true,
    enabled: enabled,
  });

  return trendingStreetPostsQuery;
};
