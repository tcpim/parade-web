import { useMutation } from "@tanstack/react-query";
import { ReactEmojiRequest } from "../../backend_declarations/main_server/main_server.did";
import { useMainServer } from "./useMainServer";

interface ReactEmojiProps {
  postId?: string;
  replyId?: string;
  userPid: string;
}

export const useReactEmoji = (props: ReactEmojiProps) => {
  const mainServer = useMainServer();

  const addEmoji = (props: ReactEmojiProps, emoji: string) => {
    const request: ReactEmojiRequest = {
      post_id: props.postId === undefined ? [] : [props.postId],
      reply_id: props.replyId === undefined ? [] : [props.replyId],
      user: props.userPid,
      emoji: emoji,
      created_ts: BigInt(Date.now()),
    };

    console.log(request);
    return mainServer.react_emoji(request);
  };

  const reactEmojiMutation = useMutation((emoji: string) =>
    addEmoji(props, emoji)
  );
  return reactEmojiMutation;
};
