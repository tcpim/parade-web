import { CircularProgress } from "@mui/material";
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

const CenteredDiv = styled.div`
  display: flex;
  justify-content: center;
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
      <CenteredDiv>
        <CircularProgress />
      </CenteredDiv>
    );
  } else if (userPostQuery.isError || userPostQuery.data === undefined) {
    return (
      <CenteredDiv>
        <h6>Something went wrong</h6>
      </CenteredDiv>
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
        <div>
          <CircularProgress />
        </div>
      )}
    </Wrapper>
  );
};

export const UserPostsMemo = memo(UserPosts);
