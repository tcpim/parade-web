import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import {
  GetTrendingCollectionPostRequest,
  TrendingPostCollectionKey,
} from "../../../backend_declarations/main_server/main_server.did";
import { Post } from "../../types/post";
import { DEFAULT_PAGE_SIZE_FOR_FEED } from "../../utils/constants";
import { getPostFromPostTypes } from "../fetch-posts/helper";
import { useMainServer } from "../useMainServer";

interface TrendingStreetCollectionPostsPage {
  posts: Array<Post>;
  next_cursor: [TrendingPostCollectionKey] | [];
}

const getFetchRequest = (
  canisterId: string,
  cursor: [] | [TrendingPostCollectionKey],
  pageLimit: number
): GetTrendingCollectionPostRequest => {
  return {
    canister_id: canisterId,
    cursor: cursor,
    limit: [pageLimit],
  };
};

export const useTrendingCollectionPosts = (canisterId = "", enabled = true) => {
  const mainServer = useMainServer();
  const queryClient = useQueryClient();

  const queryFunction = async (
    cursor: [] | [TrendingPostCollectionKey]
  ): Promise<TrendingStreetCollectionPostsPage> => {
    const len = DEFAULT_PAGE_SIZE_FOR_FEED;
    const request = getFetchRequest(canisterId, cursor, len);
    const streetPosts = await mainServer.get_trending_collection_posts(request);
    const next_cursor = streetPosts.next_cursor;

    const posts = await getPostFromPostTypes(
      len,
      streetPosts.posts,
      queryClient
    );

    const result: TrendingStreetCollectionPostsPage = {
      posts: posts,
      next_cursor: next_cursor,
    };
    return result;
  };

  const trendingCollectionPostsQuery = useInfiniteQuery<
    TrendingStreetCollectionPostsPage,
    Error
  >({
    queryKey: ["trendingCollectionPosts", canisterId],
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

  return trendingCollectionPostsQuery;
};
