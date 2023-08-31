import { useInfiniteQuery } from "@tanstack/react-query";
import {
  GetTrendingPostRequest,
  TrendingPostKey,
} from "../../../backend_declarations/club_server/ludo_arts_club.did";
import { Post, PostsPage, convertToPost } from "../../types/post";
import { DEFAULT_PAGE_SIZE_FOR_FEED } from "../../utils/constants";
import { useClubServerActor } from "../server-connect/useClubServerActor";

const getFetchRequest = (
  cursor: [] | [TrendingPostKey]
): GetTrendingPostRequest => {
  return {
    cursor: cursor,
    limit: [DEFAULT_PAGE_SIZE_FOR_FEED],
  };
};

export const useTrendingClubPosts = (clubId: string, enabled = true) => {
  const clubServer = useClubServerActor(clubId);
  const trendingClubPostsQuery = useInfiniteQuery<
    PostsPage<TrendingPostKey>,
    Error
  >({
    queryKey: ["trendingClubPosts", clubId],
    queryFn: async ({ pageParam = [] }) => {
      if (clubServer === undefined) {
        throw new Error("Club server is undefined");
      }

      const request = getFetchRequest(pageParam);
      const response = await clubServer.get_trending_posts(request);

      const result: PostsPage<TrendingPostKey> = {
        posts: response.posts
          .map((post) => convertToPost(post))
          .filter((post) => post !== undefined) as Post[],
        next_cursor: response.next_cursor,
      };
      return result;
    },
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

  return trendingClubPostsQuery;
};
