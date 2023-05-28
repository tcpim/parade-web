import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { useMainServer } from "./useMainServer";
import {
  GetStreetPostsRequest,
  GetStreetPostsResponse,
  PostCreatedTsKey,
} from "../../backend_declarations/main_server/main_server.did";

const PAGE_SIZE = 3;
const getFetchRequest = (
  cursor: [] | [PostCreatedTsKey]
): GetStreetPostsRequest => {
  return {
    cursor: cursor,
    limit: [PAGE_SIZE],
  };
};

export const useStreetPosts = () => {
  const mainServer = useMainServer();

  const streetPostsQuery = useInfiniteQuery<GetStreetPostsResponse, Error>({
    queryKey: ["streetPosts"],
    queryFn: async ({ pageParam = [] }) => {
      const request = getFetchRequest(pageParam);
      const response = await mainServer.get_street_posts(request);
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

  return streetPostsQuery;
};
