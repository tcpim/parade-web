import * as amplitude from "@amplitude/analytics-browser";
import SendIcon from "@mui/icons-material/Send";
import { Box, CircularProgress, IconButton, TextField } from "@mui/material";
import { useContext, useState } from "react";
import { styled } from "styled-components";
import { AppContext } from "../../App";
import { useSendMessage } from "../../hooks/chat/useSendMessage";
import { useUserBelongToClub } from "../../hooks/user/useUserBelongToClub";
import { MAX_CLUB_MESSAGE_LENGTH } from "../../utils/constants";

const StyledSendDiv = styled.div`
  width: 4rem;
  display: flex;
  justify-content: center;
  align-items: center;
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
  const belong = useUserBelongToClub(
    appContext.userLoginInfo.userAccount,
    clubId ?? ""
  );

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
    amplitude.track("send_club_message", { clubId: clubId });
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevents newline from being added to the TextField
      handleSendMessage();
    }
  };

  const sendButton = () => {
    if (sendMessageMutation.isLoading) {
      return (
        <StyledSendDiv>
          <CircularProgress />
        </StyledSendDiv>
      );
    } else if (sendMessageMutation.isError) {
      return (
        <StyledSendDiv>
          <p>Something went wrong</p>
        </StyledSendDiv>
      );
    } else {
      return (
        <StyledSendDiv>
          <IconButton
            disabled={
              message === "" ||
              !belong ||
              message.length > MAX_CLUB_MESSAGE_LENGTH
            }
            onClick={handleSendMessage}
          >
            <SendIcon />
          </IconButton>
        </StyledSendDiv>
      );
    }
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
        onKeyDown={handleKeyDown}
        fullWidth
        multiline
        error={message.length > MAX_CLUB_MESSAGE_LENGTH}
        helperText={
          message.length > MAX_CLUB_MESSAGE_LENGTH ? "Max 500 characters" : ""
        }
      />
      {sendButton()}
    </Box>
  );
};
