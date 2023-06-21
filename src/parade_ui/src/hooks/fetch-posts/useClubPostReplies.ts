import { useInfiniteQuery } from "@tanstack/react-query";
import {
  GetPostRepliesRequest,
  GetPostRepliesResponse,
} from "../../../backend_declarations/club_server/ludo_arts_club.did";
import { DEFAULT_PAGE_SIZE_FOR_REPLIES } from "../../utils/constants";
import { getClubServer } from "../useClubServer";

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

export const useClubPostRepiles = (
  postId: string,
  clubId: string,
  enabled: boolean
) => {
  const postRepliesQuery = useInfiniteQuery<GetPostRepliesResponse, Error>({
    queryKey: ["clubPostReplies", postId],
    queryFn: async ({ pageParam = 0 }) => {
      const request = getPostRepliesRequest(postId, pageParam);
      const response = await getClubServer(clubId).get_post_replies(request);
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
