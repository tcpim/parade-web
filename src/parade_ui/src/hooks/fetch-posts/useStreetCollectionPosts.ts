import { useInfiniteQuery } from "@tanstack/react-query";
import {
  CollectionPostCreatedTsKey,
  GetCollectionPostsRequest,
} from "../../../backend_declarations/main_server/main_server.did";
import { Post } from "../../types/post";
import { DEFAULT_PAGE_SIZE_FOR_FEED } from "../../utils/constants";
import { useMainServerActorQuery } from "../server-connect/useMainServerActor";
import { useGetPostFromPostTypes } from "./useGetPostFromPostTypes";

interface StreetCollectionPostsPage {
  posts: Array<Post>;
  next_cursor: [CollectionPostCreatedTsKey] | [];
}

const getFetchRequest = (
  canisterId: string,
  cursor: [] | [CollectionPostCreatedTsKey],
  limit: number
): GetCollectionPostsRequest => {
  return {
    canister_id: canisterId,
    cursor: cursor,
    limit: [limit],
  };
};

export const useStreetCollectionPosts = (canisterId = "", enabled = true) => {
  const mainServer = useMainServerActorQuery();
  const getPosts = useGetPostFromPostTypes();

  const collectionPostsQuery = useInfiniteQuery<
    StreetCollectionPostsPage,
    Error
  >({
    queryKey: ["collectionPosts", canisterId],
    queryFn: async ({ pageParam = [] }) => {
      const len = DEFAULT_PAGE_SIZE_FOR_FEED;
      const request = getFetchRequest(canisterId, pageParam, len);

      const collectionPosts = await mainServer.get_posts_by_collection(request);
      const posts = await getPosts(len, collectionPosts.posts);

      const result: StreetCollectionPostsPage = {
        posts: posts,
        next_cursor: collectionPosts.next_cursor,
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
    staleTime: 1000 * 60, // 1 minute
    keepPreviousData: true,
    enabled: enabled,
  });

  return collectionPostsQuery;
};
