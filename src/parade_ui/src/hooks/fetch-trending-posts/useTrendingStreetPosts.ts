import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import {
  GetTrendingStreetPostRequest,
  TrendingPostKey,
} from "../../../backend_declarations/main_server/main_server.did";
import { Post } from "../../types/post";
import { DEFAULT_PAGE_SIZE_FOR_FEED } from "../../utils/constants";
import { getPostFromPostTypes } from "../fetch-posts/helper";
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
  const queryClient = useQueryClient();

  const queryFunction = async (
    cursor: [] | [TrendingPostKey]
  ): Promise<TrendingStreetPostsPage> => {
    const len = DEFAULT_PAGE_SIZE_FOR_FEED;
    const request = getFetchRequest(cursor, len);
    const streetPosts = await mainServer.get_trending_street_posts(request);
    const next_cursor = streetPosts.next_cursor;

    const posts = await getPostFromPostTypes(
      len,
      streetPosts.posts,
      queryClient
    );

    const result: TrendingStreetPostsPage = {
      posts: posts,
      next_cursor: next_cursor,
    };
    return result;
  };

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
