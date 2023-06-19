import { ActorSubclass } from "@dfinity/agent";
import {
  QueryClient,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  GetStreetPostsRequest,
  _SERVICE as MainServer,
  PostCreatedTsKey,
} from "../../../backend_declarations/main_server/main_server.did";
import { Post } from "../../types/post";
import { DEFAULT_PAGE_SIZE_FOR_FEED } from "../../utils/constants";
import { useMainServer } from "../useMainServer";
import { getPostFromPostTypes } from "./helper";

interface StreetPostsPage {
  posts: Array<Post>;
  next_cursor: [PostCreatedTsKey] | [];
}

const getFetchRequest = (
  cursor: [] | [PostCreatedTsKey]
): GetStreetPostsRequest => {
  return {
    cursor: cursor,
    limit: [DEFAULT_PAGE_SIZE_FOR_FEED],
  };
};

export const useStreetPosts = (enabled = true) => {
  const mainServer = useMainServer();
  const queryClient = useQueryClient();

  const queryFunction = async (
    cursor: [] | [PostCreatedTsKey],
    server: ActorSubclass<MainServer>,
    queryClient: QueryClient
  ): Promise<StreetPostsPage> => {
    const len = DEFAULT_PAGE_SIZE_FOR_FEED;
    const request = getFetchRequest(cursor);
    const streetPosts = await server.get_street_posts(request);

    const next_cursor = streetPosts.next_cursor;

    const posts = await getPostFromPostTypes(
      len,
      streetPosts.posts,
      queryClient
    );

    const result: StreetPostsPage = {
      posts: posts,
      next_cursor: next_cursor,
    };
    return result;
  };

  const streetPostsQuery = useInfiniteQuery<StreetPostsPage, Error>({
    queryKey: ["streetPosts"],
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

  return streetPostsQuery;
};
