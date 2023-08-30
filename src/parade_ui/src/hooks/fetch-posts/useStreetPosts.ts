import { ActorSubclass } from "@dfinity/agent";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import {
  GetStreetPostsRequest,
  _SERVICE as MainServer,
  PostCreatedTsKey,
} from "../../../backend_declarations/main_server/main_server.did";
import { Post } from "../../types/post";
import { DEFAULT_PAGE_SIZE_FOR_FEED } from "../../utils/constants";
import { useMainServerActor } from "../server-connect/useMainServerActor";
import { useGetPostFromPostTypes } from "./useGetPostFromPostTypes";

interface StreetPostsPage {
  posts: Array<Post>;
  next_cursor: [PostCreatedTsKey] | [];
}

const getFetchRequest = (
  cursor: [] | [PostCreatedTsKey],
  limit: number
): GetStreetPostsRequest => {
  return {
    cursor: cursor,
    limit: [limit],
  };
};

export const useStreetPosts = (enabled = true) => {
  const mainServer = useMainServerActor();
  const getPosts = useGetPostFromPostTypes();

  const queryFunction = useCallback(
    async (
      cursor: [] | [PostCreatedTsKey],
      server: ActorSubclass<MainServer>
    ): Promise<StreetPostsPage> => {
      const len = DEFAULT_PAGE_SIZE_FOR_FEED;
      const request = getFetchRequest(cursor, len);
      const streetPosts = await server.get_street_posts(request);
      const posts = await getPosts(len, streetPosts.posts);

      const result: StreetPostsPage = {
        posts: posts,
        next_cursor: streetPosts.next_cursor,
      };
      return result;
    },
    [getPosts]
  );

  const streetPostsQuery = useInfiniteQuery<StreetPostsPage, Error>({
    queryKey: ["streetPosts"],
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
    staleTime: 1000 * 60, // 1 minute
    keepPreviousData: true,
    enabled: enabled,
  });

  return streetPostsQuery;
};
