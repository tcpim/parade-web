import { CircularProgress, Divider } from "@mui/material";
import { Fragment, useEffect, useRef, useState } from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useNavigate, useParams } from "react-router-dom";
import { styled } from "styled-components";
import { useGetMessages } from "../../hooks/chat/useGetMessages";
import { ClubLayout } from "../Club/ClubLayout";
import { ChatMessage } from "./ChatMessage";
import { ChatMessageEditor } from "./ChatMessageEditor";
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  height: 80vh;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
`;

const MessageBox = styled.div`
  flex: 1;
  overflow: scroll;
  display: flex;
  flex-direction: column;
`;

const StyledButton = styled.button`
  height: 3rem;
  border-radius: 0.5rem;
  border: none;
  display: flex;
  gap: 0.5rem;
  align-items: center;
  background-color: rgba(255, 56, 92, 1);
  color: white;
  padding: 0.5rem;
  width: 12rem;
`;

export const ClubChatRoom = () => {
  const { clubId } = useParams();
  const messagesQuery = useGetMessages(clubId ?? "");
  const navigate = useNavigate();

  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const prevScrollPositionRef = useRef<number | null>(null);
  const [shouldRemainPosition, setShouldRemainPosition] = useState(true);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) {
      return;
    }

    // Scroll to bottom on initial load
    container.scrollTop = container.scrollHeight;

    // Remain position in previous scroll position after fetched previous page
    if (prevScrollPositionRef.current && shouldRemainPosition) {
      container.scrollTop =
        container.scrollHeight - prevScrollPositionRef.current;
    }

    // Fetch previous page when scrolled to top
    const handleScroll = () => {
      // Check if scrolled to the top
      const isAtTop = container.scrollTop <= 10;

      if (isAtTop) {
        if (messagesQuery.isFetchingPreviousPage) return;
        prevScrollPositionRef.current =
          container.scrollHeight - container.scrollTop;
        messagesQuery.fetchPreviousPage();
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });

    setShouldRemainPosition(true);
    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [messagesContainerRef.current, messagesQuery.data]);

  // Scroll to bottom when new message is added
  const scrollToBottom = () => {
    const container = messagesContainerRef.current;
    if (!container) {
      return;
    }
    container.scrollTop = container.scrollHeight;
    setShouldRemainPosition(false);
  };

  if (clubId === undefined) {
    throw new Error("clubId is undefined");
  }

  if (messagesQuery.isLoading) {
    return <CircularProgress />;
  } else if (
    messagesQuery.status === "error" ||
    messagesQuery.data === undefined
  ) {
    return <h6>{messagesQuery.error?.message}</h6>;
  }

  const Chat = () => {
    return (
      <Wrapper>
        <StyledButton onClick={() => navigate("/clubs/" + clubId)}>
          <AiOutlineArrowLeft /> Go back to club feed
        </StyledButton>
        <Divider orientation="horizontal" />
        <MessageBox ref={messagesContainerRef}>
          {messagesQuery.isFetchingNextPage && <CircularProgress />}
          {messagesQuery.data.pages.map((page, index) => (
            <Fragment key={index}>
              {page.messages
                .slice()
                .reverse()
                .map((msg) => (
                  <Fragment key={msg.id}>
                    <ChatMessage message={msg} />
                  </Fragment>
                ))}
            </Fragment>
          ))}
        </MessageBox>
        <ChatMessageEditor clubId={clubId} scrollToBottom={scrollToBottom} />
      </Wrapper>
    );
  };

  return <ClubLayout clubId={clubId}>{Chat()}</ClubLayout>;
};
