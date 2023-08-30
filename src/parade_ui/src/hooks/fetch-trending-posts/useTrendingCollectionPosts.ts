import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import {
  GetTrendingCollectionPostRequest,
  TrendingPostCollectionKey,
} from "../../../backend_declarations/main_server/main_server.did";
import { PostsPage } from "../../types/post";
import { DEFAULT_PAGE_SIZE_FOR_FEED } from "../../utils/constants";
import { useGetPostFromPostTypes } from "../fetch-posts/useGetPostFromPostTypes";
import { useMainServerActor } from "../server-connect/useMainServerActor";

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
  const mainServer = useMainServerActor();
  const getPosts = useGetPostFromPostTypes();

  const queryFunction = useCallback(
    async (
      cursor: [] | [TrendingPostCollectionKey]
    ): Promise<PostsPage<TrendingPostCollectionKey>> => {
      const len = DEFAULT_PAGE_SIZE_FOR_FEED;
      const request = getFetchRequest(canisterId, cursor, len);
      const streetPosts = await mainServer.get_trending_collection_posts(
        request
      );
      const posts = await getPosts(len, streetPosts.posts);

      const result: PostsPage<TrendingPostCollectionKey> = {
        posts: posts,
        next_cursor: streetPosts.next_cursor,
      };
      return result;
    },
    [getPosts]
  );

  const trendingCollectionPostsQuery = useInfiniteQuery<
    PostsPage<TrendingPostCollectionKey>,
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
    staleTime: 1000 * 60 * 5, // 5 minutes
    keepPreviousData: true,
    enabled: enabled,
  });

  return trendingCollectionPostsQuery;
};
