import { ChatClubMessage } from "../../backend_declarations/club_server/ludo_arts_club.did";

export interface Message {
  id: string;
  sender: string;
  created_ts: bigint;
  words: string;
  updated_ts: bigint;
  emoji_reactions: Array<[string, number]>;
}

export interface MessagePage {
  messages: Array<Message>;
  next_cursor: [bigint] | [];
}

export const convertToMessage = (
  message?: ChatClubMessage
): Message | undefined => {
  if (!message) {
    return undefined;
  }

  return {
    id: message.id,
    sender: message.user_id,
    created_ts: message.created_ts,
    words: message.words,
    updated_ts: message.updated_ts,
    emoji_reactions: message.emoji_reactions,
  };
};
