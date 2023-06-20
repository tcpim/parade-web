import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import {
  GetTrendingCollectionPostRequest,
  TrendingPostCollectionKey,
} from "../../../backend_declarations/main_server/main_server.did";
import { Post } from "../../types/post";
import { DEFAULT_PAGE_SIZE_FOR_FEED } from "../../utils/constants";
import { useGetPostFromPostTypes } from "../fetch-posts/useGetPostFromPostTypes";
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
  const getPosts = useGetPostFromPostTypes();

  const queryFunction = useCallback(
    async (
      cursor: [] | [TrendingPostCollectionKey]
    ): Promise<TrendingStreetCollectionPostsPage> => {
      const len = DEFAULT_PAGE_SIZE_FOR_FEED;
      const request = getFetchRequest(canisterId, cursor, len);
      const streetPosts = await mainServer.get_trending_collection_posts(
        request
      );
      const posts = await getPosts(len, streetPosts.posts);

      const result: TrendingStreetCollectionPostsPage = {
        posts: posts,
        next_cursor: streetPosts.next_cursor,
      };
      return result;
    },
    [getPosts]
  );

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
