import { useMutation } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";
import { SendClubMessageRequest } from "../../../backend_declarations/club_server/ludo_arts_club.did";
import { getClubServer } from "../useClubServer";

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
  const clubServer = getClubServer(clubId);
  const request = getSendClubMessageRequest(message, sender);

  const mutation = useMutation({
    mutationFn: () => {
      return clubServer.send_club_message(request);
    },
    onSuccess: () => {
      // attach new message
      onSuccessCallback();
    },
  });

  return mutation;
};
