import { Box, Card, CardContent, Typography } from "@mui/material";
import { useContext } from "react";
import { AppContext } from "../../App";
import { useGetUser } from "../../hooks/user/useGetUser";
import { Message } from "../../types/message";
import { UserAvatar } from "../Profile/Avatar";

export interface ChatMessageProps {
  message: Message;
}
export const ChatMessage = ({ message }: ChatMessageProps) => {
  const appContext = useContext(AppContext);
  const userId = appContext.userLoginInfo.userPid;
  const userInfoQuery = useGetUser(message.sender);
  const selfMessage = userId === message.sender;

  const messageStyle = selfMessage
    ? {
        marginLeft: "auto",
        marginRight: "10px",
        backgroundColor: "#dbf5ff",
      }
    : {
        backgroundColor: "#f5f5f5",
        marginRight: "auto",
        marginLeft: "10px",
      };

  return (
    <Box display="flex" flexDirection="column" width="100%">
      <Box display="flex" sx={{ ...messageStyle, backgroundColor: "none" }}>
        <UserAvatar size={20} userId={message.sender} canChange={false} />
        <Typography variant="subtitle1" component="span" marginLeft="10px">
          {userInfoQuery.data?.username ?? userInfoQuery.data?.userId}
        </Typography>
      </Box>
      <Card
        sx={{
          borderRadius: "16px",
          marginTop: "10px",
          maxWidth: "80%",
          marginBottom: "10px",
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
