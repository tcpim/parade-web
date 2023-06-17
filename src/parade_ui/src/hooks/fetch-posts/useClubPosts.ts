import { useInfiniteQuery } from "@tanstack/react-query";
import {
  GetPostsRequest,
  GetPostsResponse,
  PostCreatedTsKey,
} from "../../../backend_declarations/club_server/ludo_arts_club.did";
import { DEFAULT_PAGE_SIZE_FOR_FEED } from "../../utils/constants";
import { useClubServer } from "../useClubServer";

const getFetchRequest = (cursor: [] | [PostCreatedTsKey]): GetPostsRequest => {
  return {
    cursor: cursor,
    limit: [DEFAULT_PAGE_SIZE_FOR_FEED],
  };
};

export const useClubPosts = (clubId: string, enabled = true) => {
  const server = useClubServer(clubId);

  const clubPostsQuery = useInfiniteQuery<GetPostsResponse, Error>({
    queryKey: ["clubPosts", clubId],
    queryFn: async ({ pageParam = [] }) => {
      const request = getFetchRequest(pageParam);
      const response = await server.get_posts(request);
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

  return clubPostsQuery;
};
