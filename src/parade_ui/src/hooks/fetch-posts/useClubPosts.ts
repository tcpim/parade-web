import { useInfiniteQuery } from "@tanstack/react-query";
import {
  GetPostsRequest,
  PostCreatedTsKey,
} from "../../../backend_declarations/club_server/ludo_arts_club.did";
import { Post, PostsPage, convertToPost } from "../../types/post";
import { DEFAULT_PAGE_SIZE_FOR_FEED } from "../../utils/constants";
import { getClubServer } from "../useClubServer";

const getFetchRequest = (cursor: [] | [PostCreatedTsKey]): GetPostsRequest => {
  return {
    cursor: cursor,
    limit: [DEFAULT_PAGE_SIZE_FOR_FEED],
  };
};

export const useClubPosts = (clubId: string, enabled = true) => {
  const clubPostsQuery = useInfiniteQuery<PostsPage<PostCreatedTsKey>, Error>({
    queryKey: ["clubPosts", clubId],
    queryFn: async ({ pageParam = [] }) => {
      const request = getFetchRequest(pageParam);
      const response = await getClubServer(clubId).get_posts(request);

      const result: PostsPage<PostCreatedTsKey> = {
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
    //staleTime: 1000 * 60,
    keepPreviousData: true,
    enabled: enabled,
  });

  return clubPostsQuery;
};
