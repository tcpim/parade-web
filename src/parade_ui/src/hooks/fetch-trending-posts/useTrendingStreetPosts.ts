import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import {
  GetTrendingStreetPostRequest,
  TrendingPostKey,
} from "../../../backend_declarations/main_server/main_server.did";
import { Post } from "../../types/post";
import { DEFAULT_PAGE_SIZE_FOR_FEED } from "../../utils/constants";
import { useGetPostFromPostTypes } from "../fetch-posts/useGetPostFromPostTypes";
import { useMainServer } from "../useMainServer";

interface TrendingStreetPostsPage {
  posts: Array<Post>;
  next_cursor: [TrendingPostKey] | [];
}

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
  const mainServer = useMainServer();
  const getPosts = useGetPostFromPostTypes();

  const queryFunction = useCallback(
    async (
      cursor: [] | [TrendingPostKey]
    ): Promise<TrendingStreetPostsPage> => {
      const len = DEFAULT_PAGE_SIZE_FOR_FEED;
      const request = getFetchRequest(cursor, len);
      const streetPosts = await mainServer.get_trending_street_posts(request);
      const posts = await getPosts(len, streetPosts.posts);

      const result: TrendingStreetPostsPage = {
        posts: posts,
        next_cursor: streetPosts.next_cursor,
      };
      return result;
    },
    [getPosts]
  );

  const trendingStreetPostsQuery = useInfiniteQuery<
    TrendingStreetPostsPage,
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
    //staleTime: 1000 * 60,
    keepPreviousData: true,
    enabled: enabled,
  });

  return trendingStreetPostsQuery;
};
