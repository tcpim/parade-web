import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  GetPostRepliesResponse,
  ReplyPostRequest,
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

  const addReply = async (props: CreatePostReplyProps) => {
    const request = getReplyPostRequest(props);
    return await mainServer.reply_post(request);
  };

  const mutation = useMutation(
    () => addReply(props)
    // {
    //   onMutate: () => {
    //     const newReply = {
    //       id: "newReply",
    //       post_id: props.postId,
    //       emoji_reactions: [],
    //       nfts: [],
    //       created_by: props.userPid,
    //       created_ts: BigInt(Date.now()),
    //       words: props.words,
    //     };

    //     queryClient.setQueryData<InfiniteData<Array<GetPostRepliesResponse>>>(
    //       ["postReplies", props.postId],
    //       (oldData) => {
    //         if (oldData === undefined) {
    //           return undefined;
    //         }
    //         const firstPageUnknow = oldData?.pages[0] as unknown;
    //         const firstPage = firstPageUnknow as GetPostRepliesResponse;

    //         const newFirstPage = [
    //           {
    //             ...firstPage,
    //             post_replies: [newReply, ...firstPage.post_replies],
    //           },
    //         ];
    //         return {
    //           pages: [newFirstPage, ...oldData.pages.slice(1)],
    //           pageParams: oldData.pageParams,
    //         };
    //       }
    //     );
    //   },
    // }
  );

  return mutation;
};
