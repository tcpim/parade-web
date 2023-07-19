import { Box, CircularProgress, Typography } from "@mui/material";
import { Fragment, memo } from "react";
import { styled } from "styled-components";
import { useUserPosts } from "../../hooks/fetch-posts/useUserPosts";
import { useScrollToBottomAction } from "../../hooks/useScrollToBottomAction";
import { PostCardMemo } from "./PostCard";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

interface UserPostsProps {
  userPid: string;
}

const UserPosts = ({ userPid }: UserPostsProps) => {
  const userPostQuery = useUserPosts(userPid);

  useScrollToBottomAction(
    document,
    () => {
      if (userPostQuery.isFetchingNextPage) return;
      userPostQuery.fetchNextPage();
    },
    200
  );

  if (userPostQuery.isLoading) {
    return (
      <Box>
        <CircularProgress />
      </Box>
    );
  } else if (
    userPostQuery.status === "error" ||
    userPostQuery.data === undefined
  ) {
    return (
      <Typography color="error" align="center" variant="h6" gutterBottom>
        {userPostQuery.error?.message}
      </Typography>
    );
  }

  return (
    <Wrapper>
      {userPostQuery.data.pages.map((page, index) => (
        <Fragment key={index}>
          {page.posts.map((post) => (
            <Fragment key={post.postId}>
              <PostCardMemo post={post} />
            </Fragment>
          ))}
        </Fragment>
      ))}
      {userPostQuery.isFetchingNextPage && (
        <Box>
          <CircularProgress />
        </Box>
      )}
    </Wrapper>
  );
};

export const UserPostsMemo = memo(UserPosts);
