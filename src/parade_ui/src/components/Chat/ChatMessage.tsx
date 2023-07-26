import { useContext } from "react";
import { styled } from "styled-components";
import { AppContext } from "../../App";
import { useGetUser } from "../../hooks/user/useGetUser";
import { Message } from "../../types/message";
import { truncateStr } from "../../utils/strings";
import { UserAvatar } from "../Profile/Avatar";

interface WrapperProps {
  selfMessage: boolean;
}

const Wrapper = styled.div<WrapperProps>`
  display: flex;
  flex-direction: column;
  align-self: ${(props) => (props.selfMessage ? "flex-end" : "flex-start")};
  margin: 0 1rem;
`;

const MessageHeader = styled.div<WrapperProps>`
  display: flex;
  margin-left: ${(props) => (props.selfMessage ? "auto" : "0")};
  margin-right: ${(props) => (props.selfMessage ? "0" : "auto")};
`;

const Message = styled.div<WrapperProps>`
  border-radius: 0.5rem;
  margin-top: 1rem;
  max-width: 20rem;
  margin-bottom: 1rem;
  background-color: ${(props) => (props.selfMessage ? "#dbf5ff" : "#e8ebec")};
  padding: 0.5rem;
`;

export interface ChatMessageProps {
  message: Message;
}
export const ChatMessage = ({ message }: ChatMessageProps) => {
  const appContext = useContext(AppContext);
  const userId = appContext.userLoginInfo.userPid;
  const userInfoQuery = useGetUser(message.sender);
  const selfMessage = userId === message.sender;

  return (
    <Wrapper selfMessage={selfMessage}>
      <MessageHeader selfMessage={selfMessage}>
        <UserAvatar size={20} userId={message.sender} canChange={false} />
        <p>
          {truncateStr(
            userInfoQuery.data?.username ??
              userInfoQuery.data?.userId ??
              "unknown user",
            10
          )}
        </p>
      </MessageHeader>
      <Message selfMessage={selfMessage}>{message.words}</Message>
    </Wrapper>
  );
};
