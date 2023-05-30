import { useInfiniteQuery } from "@tanstack/react-query";
import {
  GetTrendingClubPostRequest,
  GetTrendingClubPostResponse,
  TrendingPostClubKey,
} from "../../../backend_declarations/main_server/main_server.did";
import { DEFAULT_PAGE_SIZE_FOR_FEED } from "../../utils/constants";
import { useMainServer } from "../useMainServer";

const getFetchRequest = (
  clubId: string,
  cursor: [] | [TrendingPostClubKey]
): GetTrendingClubPostRequest => {
  return {
    club_id: clubId,
    cursor: cursor,
    limit: [DEFAULT_PAGE_SIZE_FOR_FEED],
  };
};

export const useTrendingClubPosts = (clubId: string, enabled = true) => {
  const mainServer = useMainServer();

  const trendingClubPostsQuery = useInfiniteQuery<
    GetTrendingClubPostResponse,
    Error
  >({
    queryKey: ["trendingClubPosts", clubId],
    queryFn: async ({ pageParam = [] }) => {
      const request = getFetchRequest(clubId, pageParam);
      const response = await mainServer.get_trending_club_posts(request);
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

  return trendingClubPostsQuery;
};
