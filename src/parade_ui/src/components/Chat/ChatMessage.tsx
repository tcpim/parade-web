import { Box, Card, CardContent, Typography } from "@mui/material";
import { useContext } from "react";
import { AppContext } from "../../App";
import { Message } from "../../types/message";

export interface ChatMessageProps {
  message: Message;
}
export const ChatMessage = ({ message }: ChatMessageProps) => {
  const appContext = useContext(AppContext);
  const selfMessage = appContext.userLoginInfo.userPid === message.sender;

  const messageStyle = selfMessage
    ? {
        alignSelf: "flex-end",
        backgroundColor: "#dbf5ff",
      }
    : {};

  return (
    <Box display="flex" width="100%">
      <Card
        sx={{
          borderRadius: "16px",
          backgroundColor: "#f5f5f5",
          marginTop: "10px",
          maxWidth: "80%",
          marginBottom: "100px",
          ...messageStyle,
        }}
      >
        <CardContent>
          <Typography variant="body1">{message.words}</Typography>
        </CardContent>
      </Card>
    </Box>
  );
};
