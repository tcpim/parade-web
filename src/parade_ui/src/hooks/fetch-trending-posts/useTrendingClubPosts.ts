import { useInfiniteQuery } from "@tanstack/react-query";
import {
  GetTrendingPostRequest,
  GetTrendingPostResponse,
  TrendingPostKey,
} from "../../../backend_declarations/club_server/ludo_arts_club.did";
import { DEFAULT_PAGE_SIZE_FOR_FEED } from "../../utils/constants";
import { useClubServer } from "../useClubServer";

const getFetchRequest = (
  clubId: string,
  cursor: [] | [TrendingPostKey]
): GetTrendingPostRequest => {
  return {
    cursor: cursor,
    limit: [DEFAULT_PAGE_SIZE_FOR_FEED],
  };
};

export const useTrendingClubPosts = (clubId: string, enabled = true) => {
  const clubServer = useClubServer(clubId);

  const trendingClubPostsQuery = useInfiniteQuery<
    GetTrendingPostResponse,
    Error
  >({
    queryKey: ["trendingClubPosts", clubId],
    queryFn: async ({ pageParam = [] }) => {
      const request = getFetchRequest(clubId, pageParam);
      const response = await clubServer.get_trending_posts(request);
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
