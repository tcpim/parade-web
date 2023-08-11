import * as amplitude from "@amplitude/analytics-browser";
import SendIcon from "@mui/icons-material/Send";
import { Box, CircularProgress, IconButton, TextField } from "@mui/material";
import { useContext, useState } from "react";
import { AppContext } from "../../App";
import { useSendMessage } from "../../hooks/chat/useSendMessage";
import { useUserCollectionListForClub } from "../../hooks/fetch-nft-data/useUserCollectionListForClub";
import { MAX_CLUB_MESSAGE_LENGTH } from "../../utils/constants";

export interface ChatMessageEditorProps {
  clubId: string;
  scrollToBottom: () => void;
}

export const ChatMessageEditor = ({
  clubId,
  scrollToBottom,
}: ChatMessageEditorProps) => {
  const appContext = useContext(AppContext);
  const query = useUserCollectionListForClub(
    appContext.userLoginInfo.userAccount,
    clubId ?? ""
  );

  const belong = query.data?.tokenCount !== 0;

  const [message, setMessage] = useState("");

  const userId = appContext.userLoginInfo.userPid;

  const sendMessageMutation = useSendMessage({
    clubId: clubId,
    message: message,
    sender: userId,
    onSuccessCallback: () => {
      setMessage("");
      scrollToBottom();
    },
  });

  const handleSendMessage = () => {
    sendMessageMutation.mutate();
    amplitude.track("send_message", { clubId: clubId });
  };

  return (
    <Box display="flex">
      <TextField
        value={message}
        placeholder={
          belong
            ? "Say something..."
            : "You can't chat because you are not a member of this club"
        }
        disabled={!belong}
        onChange={(e) => setMessage(e.target.value)}
        fullWidth
        multiline
        error={message.length > MAX_CLUB_MESSAGE_LENGTH}
        helperText={
          message.length > MAX_CLUB_MESSAGE_LENGTH ? "Max 500 characters" : ""
        }
      />
      {sendMessageMutation.isLoading ? (
        <CircularProgress />
      ) : (
        <IconButton
          disabled={message === "" || query.isError || !belong}
          onClick={handleSendMessage}
        >
          <SendIcon />
        </IconButton>
      )}
    </Box>
  );
};
