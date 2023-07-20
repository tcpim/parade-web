import SendIcon from "@mui/icons-material/Send";
import { Box, CircularProgress, IconButton, TextField } from "@mui/material";
import { useContext, useState } from "react";
import { styled } from "styled-components";
import { AppContext } from "../../App";
import { useSendMessage } from "../../hooks/chat/useSendMessage";
import { MAX_CLUB_MESSAGE_LENGTH } from "../../utils/constants";

const StyledTextarea = styled.textarea`
  resize: none;
`;
export interface ChatMessageEditorProps {
  clubId: string;
  scrollToBottom: () => void;
}

export const ChatMessageEditor = ({
  clubId,
  scrollToBottom,
}: ChatMessageEditorProps) => {
  const appContext = useContext(AppContext);
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
  };

  return (
    <Box display="flex">
      <TextField
        value={message}
        placeholder="Say something..."
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
          disabled={message === "" || userId === ""}
          onClick={handleSendMessage}
        >
          <SendIcon />
        </IconButton>
      )}
    </Box>
  );
};
