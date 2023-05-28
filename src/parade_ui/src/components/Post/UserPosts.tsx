import { Box, CircularProgress, Typography } from "@mui/material";
import { Fragment, memo } from "react";
import { useUserPosts } from "../../hooks/fetch-posts/useUserPosts";
import { useScrollToBottomAction } from "../../hooks/useScrollToBottomAction";
import { PostCard } from "./PostCard";
import { getTimeperiod } from "../../utils/getTimePeriod";

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
    <Box sx={{ width: "80%", marginLeft: "10%" }}>
      {userPostQuery.data.pages.map((page, index) => (
        <Fragment key={index}>
          {page.posts.map((post) => (
            <Fragment key={post.id}>
              <PostCard
                postId={post.id}
                createdBy={post.created_by}
                timeAgo={getTimeperiod(post.created_ts)}
                content={post.words}
                replies={post.replies.length}
                emojis={post.emoji_reactions}
                nftCanisterId={post.nfts[0].canister_id}
                nftTokenIndex={post.nfts[0].token_index}
                nftImageUrl={post.nfts[0].original_thumbnail_url}
              />
            </Fragment>
          ))}
        </Fragment>
      ))}
      {userPostQuery.isFetchingNextPage && (
        <Box>
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
};

export const UserPostsMemo = memo(UserPosts);
