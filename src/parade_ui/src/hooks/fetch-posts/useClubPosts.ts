import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { useMainServer } from "../useMainServer";
import {
  GetClubPostsRequest,
  GetClubPostsResponse,
  ClubPostCreatedTsKey,
} from "../../../backend_declarations/main_server/main_server.did";
import { DEFAULT_PAGE_SIZE_FOR_FEED } from "../../utils/constants";

const getFetchRequest = (
  clubId: string,
  cursor: [] | [ClubPostCreatedTsKey]
): GetClubPostsRequest => {
  return {
    club_id: clubId,
    cursor: cursor,
    limit: [DEFAULT_PAGE_SIZE_FOR_FEED],
  };
};

export const useClubPosts = (clubId: string) => {
  const mainServer = useMainServer();

  const clubPostsQuery = useInfiniteQuery<GetClubPostsResponse, Error>({
    queryKey: ["clubPosts"],
    queryFn: async ({ pageParam = [] }) => {
      const request = getFetchRequest(clubId, pageParam);
      const response = await mainServer.get_posts_by_club(request);
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
  });

  return clubPostsQuery;
};
