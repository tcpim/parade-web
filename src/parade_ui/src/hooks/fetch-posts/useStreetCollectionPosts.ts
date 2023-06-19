import { ActorSubclass } from "@dfinity/agent";
import {
  QueryClient,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  CollectionPostCreatedTsKey,
  GetCollectionPostsRequest,
  _SERVICE as MainServer,
} from "../../../backend_declarations/main_server/main_server.did";
import { Post } from "../../types/post";
import { DEFAULT_PAGE_SIZE_FOR_FEED } from "../../utils/constants";
import { useMainServer } from "../useMainServer";
import { getPostFromPostTypes } from "./helper";

interface StreetCollectionPostsPage {
  posts: Array<Post>;
  next_cursor: [CollectionPostCreatedTsKey] | [];
}

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

export const useStreetCollectionPosts = (canisterId = "", enabled = true) => {
  const mainServer = useMainServer();
  const queryClient = useQueryClient();

  const queryFunction = async (
    cursor: [] | [CollectionPostCreatedTsKey],
    server: ActorSubclass<MainServer>,
    queryClient: QueryClient
  ): Promise<StreetCollectionPostsPage> => {
    const len = DEFAULT_PAGE_SIZE_FOR_FEED;
    const request = getFetchRequest(canisterId, cursor);
    const collectionPosts = await server.get_posts_by_collection(request);

    const next_cursor = collectionPosts.next_cursor;

    const posts = await getPostFromPostTypes(
      len,
      collectionPosts.posts,
      queryClient
    );

    const result: StreetCollectionPostsPage = {
      posts: posts,
      next_cursor: next_cursor,
    };
    return result;
  };

  const collectionPostsQuery = useInfiniteQuery<
    StreetCollectionPostsPage,
    Error
  >({
    queryKey: ["collectionPosts", canisterId],
    queryFn: async ({ pageParam = [] }) => {
      return await queryFunction(pageParam, mainServer, queryClient);
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
