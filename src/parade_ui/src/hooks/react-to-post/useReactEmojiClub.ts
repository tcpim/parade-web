import { useMutation } from "@tanstack/react-query";
import { ReactEmojiRequest } from "../../../backend_declarations/club_server/ludo_arts_club.did";
import { getClubServer } from "../useClubServer";

interface ReactEmojiProps {
  postId?: string;
  replyId?: string;
  userPid: string;
  clubId: string;
}

export const useReactEmojiClub = (props: ReactEmojiProps) => {
  const addEmoji = (props: ReactEmojiProps, emoji: string) => {
    const request: ReactEmojiRequest = {
      post_id: props.postId === undefined ? [] : [props.postId],
      reply_id: props.replyId === undefined ? [] : [props.replyId],
      user: props.userPid,
      emoji: emoji,
      created_ts: BigInt(Date.now()),
    };

    return getClubServer(props.clubId).react_emoji(request);
  };

  const reactEmojiMutation = useMutation((emoji: string) =>
    addEmoji(props, emoji)
  );
  return reactEmojiMutation;
};
