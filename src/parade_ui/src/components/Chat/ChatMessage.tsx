import { Card, CardContent, Typography } from "@mui/material";
import { Message } from "../../types/message";

export interface ChatMessageProps {
  message: Message;
}
export const ChatMessage = ({ message }: ChatMessageProps) => {
  return (
    <Card
      sx={{
        borderRadius: "16px",
        backgroundColor: "#f5f5f5",
        marginTop: "10px",
        maxWidth: "80%",
      }}
    >
      <CardContent>
        <Typography variant="body1">{message.words}</Typography>
      </CardContent>
    </Card>
  );
};
