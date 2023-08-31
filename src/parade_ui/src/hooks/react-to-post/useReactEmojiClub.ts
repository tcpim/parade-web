import { useMutation } from "@tanstack/react-query";
import { ReactEmojiRequest } from "../../../backend_declarations/club_server/ludo_arts_club.did";
import { useClubServerActor } from "../server-connect/useClubServerActor";

interface ReactEmojiProps {
  postId?: string;
  replyId?: string;
  userPid: string;
  clubId: string;
}

export const useReactEmojiClub = (props: ReactEmojiProps) => {
  const clubServer = useClubServerActor(props.clubId);
  const addEmoji = (props: ReactEmojiProps, emoji: string) => {
    const request: ReactEmojiRequest = {
      post_id: props.postId === undefined ? [] : [props.postId],
      reply_id: props.replyId === undefined ? [] : [props.replyId],
      user: props.userPid,
      emoji: emoji,
      created_ts: BigInt(Date.now()),
    };

    if (clubServer === undefined) {
      throw new Error("Club server is undefined");
    }

    return clubServer.react_emoji(request);
  };

  const reactEmojiMutation = useMutation((emoji: string) =>
    addEmoji(props, emoji)
  );
  return reactEmojiMutation;
};
