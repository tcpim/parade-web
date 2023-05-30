import { useInfiniteQuery } from "@tanstack/react-query";
import {
  GetTrendingStreetPostRequest,
  GetTrendingStreetPostResponse,
  TrendingPostKey,
} from "../../../backend_declarations/main_server/main_server.did";
import { DEFAULT_PAGE_SIZE_FOR_FEED } from "../../utils/constants";
import { useMainServer } from "../useMainServer";

const getFetchRequest = (
  cursor: [] | [TrendingPostKey]
): GetTrendingStreetPostRequest => {
  return {
    cursor: cursor,
    limit: [DEFAULT_PAGE_SIZE_FOR_FEED],
  };
};

export const useTrendingStreetPosts = (enabled = true) => {
  const mainServer = useMainServer();

  const trendingStreetPostsQuery = useInfiniteQuery<
    GetTrendingStreetPostResponse,
    Error
  >({
    queryKey: ["trendingStreetPosts"],
    queryFn: async ({ pageParam = [] }) => {
      const request = getFetchRequest(pageParam);
      const response = await mainServer.get_trending_street_posts(request);
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
    enabled: enabled,
  });

  return trendingStreetPostsQuery;
};
