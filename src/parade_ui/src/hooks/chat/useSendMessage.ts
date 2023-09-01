import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";
import { SendClubMessageRequest } from "../../../backend_declarations/club_server/ludo_arts_club.did";
import { Message, MessagePage } from "../../types/message";
import { useClubServerActorUpdate } from "../server-connect/useClubServerActor";

const getSendClubMessageRequest = (message: string, sender: string) => {
  const request: SendClubMessageRequest = {
    created_ts: BigInt(Date.now()),
    sender: sender,
    words: message,
    message_id: uuidv4(),
  };
  return request;
};

export interface SendMessageProps {
  message: string;
  sender: string;
  clubId: string;
  onSuccessCallback?: any;
}
export const useSendMessage = ({
  message,
  sender,
  clubId,
  onSuccessCallback,
}: SendMessageProps) => {
  const queryClient = useQueryClient();
  const clubServer = useClubServerActorUpdate(clubId);
  const request = getSendClubMessageRequest(message, sender);

  const mutation = useMutation({
    mutationFn: async () => {
      if (clubServer === undefined) {
        throw new Error("Club server is undefined");
      }

      const res = await clubServer.send_club_message(request);
      if (res[0] !== undefined) {
        throw new Error("Error send_club_message: " + res[0].error_message);
      }
      return res;
    },
    onSuccess: () => {
      // attach new message
      onSuccessCallback();

      // update query data to include the new message
      const newMessage: Message = {
        id: request.message_id,
        sender: request.sender,
        created_ts: request.created_ts,
        words: request.words,
        updated_ts: request.created_ts,
        emoji_reactions: [],
      };

      queryClient.setQueryData<InfiniteData<MessagePage>>(
        ["clubMessages", clubId],
        (oldData) => {
          if (oldData === undefined) {
            return undefined;
          }
          const oldLastPage: MessagePage =
            oldData.pages[oldData.pages.length - 1];

          const newLastPage: MessagePage = {
            ...oldLastPage,
            messages: [newMessage, ...oldLastPage.messages],
          };
          return {
            pages: [...oldData.pages.slice(0, -1), newLastPage],
            pageParams: oldData.pageParams,
          };
        }
      );

      onSuccessCallback();
    },
  });

  return mutation;
};
