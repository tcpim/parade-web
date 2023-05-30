import { useInfiniteQuery } from "@tanstack/react-query";
import {
  CollectionPostCreatedTsKey,
  GetCollectionPostsRequest,
  GetCollectionPostsResponse,
} from "../../../backend_declarations/main_server/main_server.did";
import { DEFAULT_PAGE_SIZE_FOR_FEED } from "../../utils/constants";
import { useMainServer } from "../useMainServer";

const getFetchRequest = (
  canisterId: string,
  cursor: [] | [CollectionPostCreatedTsKey]
): GetCollectionPostsRequest => {
  return {
    canister_id: canisterId,
    cursor: cursor,
    limit: [DEFAULT_PAGE_SIZE_FOR_FEED],
  };
};

export const useCollectionPosts = (canisterId = "", enabled = true) => {
  const mainServer = useMainServer();

  const collectionPostsQuery = useInfiniteQuery<
    GetCollectionPostsResponse,
    Error
  >({
    queryKey: ["collectionPosts", canisterId],
    queryFn: async ({ pageParam = [] }) => {
      const request = getFetchRequest(canisterId, pageParam);
      const response = await mainServer.get_posts_by_collection(request);
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

  return collectionPostsQuery;
};
