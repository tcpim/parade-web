import { useInfiniteQuery } from "@tanstack/react-query";
import {
  GetTrendingCollectionPostRequest,
  GetTrendingCollectionPostResponse,
  TrendingPostCollectionKey,
} from "../../../backend_declarations/main_server/main_server.did";
import { DEFAULT_PAGE_SIZE_FOR_FEED } from "../../utils/constants";
import { useMainServer } from "../useMainServer";

const getFetchRequest = (
  canisterId: string,
  cursor: [] | [TrendingPostCollectionKey]
): GetTrendingCollectionPostRequest => {
  return {
    canister_id: canisterId,
    cursor: cursor,
    limit: [DEFAULT_PAGE_SIZE_FOR_FEED],
  };
};

export const useTrendingCollectionPosts = (canisterId = "", enabled = true) => {
  const mainServer = useMainServer();

  const trendingCollectionPostsQuery = useInfiniteQuery<
    GetTrendingCollectionPostResponse,
    Error
  >({
    queryKey: ["trendingCollectionPosts", canisterId],
    queryFn: async ({ pageParam = [] }) => {
      const request = getFetchRequest(canisterId, pageParam);
      const response = await mainServer.get_trending_collection_posts(request);
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

  return trendingCollectionPostsQuery;
};
