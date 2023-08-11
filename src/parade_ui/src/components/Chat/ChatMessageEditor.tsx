import * as amplitude from "@amplitude/analytics-browser";
import SendIcon from "@mui/icons-material/Send";
import { Box, CircularProgress, IconButton, TextField } from "@mui/material";
import { useContext, useState } from "react";
import { styled } from "styled-components";
import { AppContext } from "../../App";
import { useSendMessage } from "../../hooks/chat/useSendMessage";
import { useUserCollectionListForClub } from "../../hooks/fetch-nft-data/useUserCollectionListForClub";
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
    amplitude.track("send_club_message", { clubId: clubId });
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevents newline from being added to the TextField
      handleSendMessage();
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
      <StyledSendDiv>
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
      </StyledSendDiv>
    </Box>
  );
};
