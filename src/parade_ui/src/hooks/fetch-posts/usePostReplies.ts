import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  GetPostRepliesRequest,
  GetPostRepliesResponse,
} from "../../../backend_declarations/main_server/main_server.did";
import { useMainServer } from "../useMainServer";
import { DEFAULT_PAGE_SIZE_FOR_REPLIES } from "../../utils/constants";

interface PostRepliesProps {
  postId: string;
}

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

export const usePostRepiles = (props: PostRepliesProps) => {
  const mainServer = useMainServer();
  const postRepliesQuery = useInfiniteQuery<GetPostRepliesResponse, Error>({
    queryKey: ["postReplies", props.postId],
    queryFn: async ({ pageParam = 0 }) => {
      const request = getPostRepliesRequest(props.postId, pageParam);
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
  });

  return postRepliesQuery;
};
