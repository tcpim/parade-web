import { useMutation } from "@tanstack/react-query";
import { ReplyPostRequest } from "../../backend_declarations/main_server/main_server.did";
import { useMainServer } from "./useMainServer";

export interface CreatePostReplyProps {
  userPid: string;
  postId: string;
  words: string;
}

const getReplyPostRequest = (props: CreatePostReplyProps): ReplyPostRequest => {
  return {
    post_id: props.postId,
    user: props.userPid,
    created_ts: BigInt(Date.now()),
    words: props.words,
    nfts: [],
  };
};

export const useCreatePostReply = (props: CreatePostReplyProps) => {
  const mainServer = useMainServer();
  const mutation = useMutation(async () => {
    const request = getReplyPostRequest(props);
    return await mainServer.reply_post(request);
  });

  return mutation;
};
