import { ActorSubclass } from "@dfinity/agent";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import {
  CollectionPostCreatedTsKey,
  GetCollectionPostsRequest,
  _SERVICE as MainServer,
} from "../../../backend_declarations/main_server/main_server.did";
import { Post } from "../../types/post";
import { DEFAULT_PAGE_SIZE_FOR_FEED } from "../../utils/constants";
import { useMainServer } from "../useMainServer";
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
  const mainServer = useMainServer();
  const getPosts = useGetPostFromPostTypes();

  const queryFunction = useCallback(
    async (
      cursor: [] | [CollectionPostCreatedTsKey],
      server: ActorSubclass<MainServer>
    ): Promise<StreetCollectionPostsPage> => {
      const len = DEFAULT_PAGE_SIZE_FOR_FEED;
      const request = getFetchRequest(canisterId, cursor, len);
      const collectionPosts = await server.get_posts_by_collection(request);
      const posts = await getPosts(len, collectionPosts.posts);

      const result: StreetCollectionPostsPage = {
        posts: posts,
        next_cursor: collectionPosts.next_cursor,
      };
      return result;
    },
    [getPosts]
  );

  const collectionPostsQuery = useInfiniteQuery<
    StreetCollectionPostsPage,
    Error
  >({
    queryKey: ["collectionPosts", canisterId],
    queryFn: async ({ pageParam = [] }) => {
      return await queryFunction(pageParam, mainServer);
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
