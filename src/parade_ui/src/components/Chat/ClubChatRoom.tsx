import { Box, CircularProgress, Divider, Typography } from "@mui/material";
import { Fragment, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useGetMessages } from "../../hooks/chat/useGetMessages";
import { ChatMessage } from "./ChatMessage";
import { ChatMessageEditor } from "./ChatMessageEditor";

export const ClubChatRoom = () => {
  const { clubId } = useParams();
  const messagesQuery = useGetMessages(clubId ?? "");

  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const prevScrollPositionRef = useRef<number | null>(null);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) {
      return;
    }

    // Scroll to bottom on initial load
    container.scrollTop = container.scrollHeight;

    // Remain position in previous scroll position when fetched previous page
    if (prevScrollPositionRef.current) {
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

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [messagesContainerRef.current, messagesQuery.data]);

  if (clubId === undefined) {
    throw new Error("clubId is undefined");
  }

  if (messagesQuery.isLoading) {
    return (
      <Box>
        <CircularProgress />
      </Box>
    );
  } else if (
    messagesQuery.status === "error" ||
    messagesQuery.data === undefined
  ) {
    return (
      <Typography color="error" align="center" variant="h6" gutterBottom>
        {messagesQuery.error?.message}
      </Typography>
    );
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      sx={{
        marginLeft: "15%",
        marginTop: "5%",
        marginRight: "15%",
        height: "90vh",
        boxShadow: "0 0 5px rgba(0, 0, 0, 0.5)",
      }}
    >
      <Box>
        <Typography variant="h6">{clubId}'s chat room</Typography>
      </Box>
      <Divider orientation="horizontal" />
      <Box ref={messagesContainerRef} sx={{ flex: "1", overflow: "auto" }}>
        {messagesQuery.isFetchingNextPage && (
          <Box>
            <CircularProgress />
          </Box>
        )}
        <Box alignItems="center">
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
        </Box>
      </Box>
      <Box
        sx={{
          marginTop: "auto",
          marginBottom: "10px",
          marginLeft: "10px",
        }}
      >
        <ChatMessageEditor clubId={clubId} />
      </Box>
    </Box>
  );
};
