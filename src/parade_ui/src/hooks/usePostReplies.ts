import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  GetPostRepliesRequest,
  GetPostRepliesResponse,
} from "../../backend_declarations/main_server/main_server.did";
import { useMainServer } from "./useMainServer";

interface PostRepliesProps {
  postId: string;
}

const PAGE_SIZE = 20;

const getPostRepliesRequest = (
  props: PostRepliesProps
): GetPostRepliesRequest => {
  return {
    post_id: props.postId,
    offset: 0,
    limit: [PAGE_SIZE],
  };
};

export const usePostRepiles = (props: PostRepliesProps) => {
  const mainServer = useMainServer();
  const postRepliesQuery = useInfiniteQuery<GetPostRepliesResponse, Error>({
    queryKey: ["postReplies", props.postId],
    queryFn: async () => {
      const request = getPostRepliesRequest(props);
      const response = await mainServer.get_post_replies(request);
      return response;
    },
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.post_replies.length < PAGE_SIZE) {
        return undefined;
      } else {
        return lastPage.offset;
      }
    },
    keepPreviousData: true,
  });

  return postRepliesQuery;
};
