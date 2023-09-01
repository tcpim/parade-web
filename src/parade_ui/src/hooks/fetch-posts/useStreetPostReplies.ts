import { useInfiniteQuery } from "@tanstack/react-query";
import {
  GetPostRepliesRequest,
  GetPostRepliesResponse,
} from "../../../backend_declarations/main_server/main_server.did";
import { DEFAULT_PAGE_SIZE_FOR_REPLIES } from "../../utils/constants";
import { useMainServerActorQuery } from "../server-connect/useMainServerActor";

const getPostRepliesRequest = (
  postId: string,
  offset: number
): GetPostRepliesRequest => {
  return {
    post_id: postId,
    offset: offset,
    limit: [DEFAULT_PAGE_SIZE_FOR_REPLIES],
  };
};

export const useStreetPostRepiles = (postId: string, enabled: boolean) => {
  const mainServer = useMainServerActorQuery();
  const postRepliesQuery = useInfiniteQuery<GetPostRepliesResponse, Error>({
    queryKey: ["postReplies", postId],
    queryFn: async ({ pageParam = 0 }) => {
      const request = getPostRepliesRequest(postId, pageParam);
      const response = await mainServer.get_post_replies(request);
      return response;
    },
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.post_replies.length < DEFAULT_PAGE_SIZE_FOR_REPLIES) {
        return undefined;
      } else {
        return lastPage.offset;
      }
    },
    keepPreviousData: true,
    enabled: enabled,
  });

  return postRepliesQuery;
};
