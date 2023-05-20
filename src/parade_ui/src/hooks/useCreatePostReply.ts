import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  CreatePostResponse,
  GetPostRepliesResponse,
  ReplyPostRequest,
  ReplyPostResponse,
} from "../../backend_declarations/main_server/main_server.did";
import { useMainServer } from "./useMainServer";
import { v4 as uuidv4 } from "uuid";

export interface CreatePostReplyProps {
  userPid: string;
  postId: string;
  words: string;
}

const getReplyPostRequest = (props: CreatePostReplyProps): ReplyPostRequest => {
  return {
    reply_id: uuidv4(),
    post_id: props.postId,
    user: props.userPid,
    created_ts: BigInt(Date.now()),
    words: props.words,
    nfts: [],
  };
};

export const useCreatePostReply = (props: CreatePostReplyProps) => {
  const mainServer = useMainServer();
  const queryClient = useQueryClient();

  const addReply = (
    props: CreatePostReplyProps
  ): Promise<ReplyPostResponse> => {
    const request = getReplyPostRequest(props);
    return mainServer.reply_post(request);
  };

  const mutation = useMutation(() => addReply(props), {
    onSuccess: () => {
      const newReply = {
        id: "newReply",
        post_id: props.postId,
        emoji_reactions: [],
        nfts: [],
        created_by: props.userPid,
        created_ts: BigInt(Date.now()),
        words: props.words,
      };

      queryClient.setQueryData<InfiniteData<GetPostRepliesResponse>>(
        ["postReplies", props.postId],
        (oldData) => {
          if (oldData === undefined) {
            return undefined;
          }
          const oldFirstPage: GetPostRepliesResponse = oldData.pages[0];

          const newFirstPage = {
            ...oldFirstPage,
            post_replies: [newReply, ...oldFirstPage.post_replies],
          };
          return {
            pages: [newFirstPage, ...oldData.pages.slice(1)],
            pageParams: oldData.pageParams,
          };
        }
      );
    },
  });

  return mutation;
};
