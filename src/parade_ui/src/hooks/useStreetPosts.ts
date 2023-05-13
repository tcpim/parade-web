import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { useMainServer } from "./useMainServer";
import {
  GetStreetPostsRequest,
  GetStreetPostsResponse,
} from "../../backend_declarations/main_server/main_server.did";

const PAGE_SIZE = 5;
const getFetchRequest = (offset: number): GetStreetPostsRequest => {
  return {
    offset: offset,
    limit: [PAGE_SIZE],
  };
};

export const useStreetPosts = () => {
  const mainServer = useMainServer();

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery<GetStreetPostsResponse, Error>({
    queryKey: ["streetPosts"],
    queryFn: async ({ pageParam = 0 }) => {
      const request = getFetchRequest(pageParam);
      const response = await mainServer.get_street_posts(request);
      return response;
    },
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.posts.length < PAGE_SIZE) {
        return undefined;
      } else {
        return lastPage.offset;
      }
    },
    //staleTime: 1000 * 60,
    keepPreviousData: true,
  });

  return {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetching,
    isFetchingNextPage,
    status,
  };
};
