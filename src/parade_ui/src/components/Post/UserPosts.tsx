import { Box, CircularProgress, Typography } from "@mui/material";
import { Fragment, memo } from "react";
import { useUserPosts } from "../../hooks/fetch-posts/useUserPosts";
import { useScrollToBottomAction } from "../../hooks/useScrollToBottomAction";
import { getTimeperiod } from "../../utils/getTimePeriod";
import { PostCard } from "./PostCard";

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
            <Fragment key={post.post_id}>
              <PostCard
                postId={post.post_id}
                createdBy={post.created_by}
                timeAgo={getTimeperiod(post.created_ts)}
                content={post.words}
                replies={post.replies.length}
                emojis={post.emoji_reactions}
                nftInfo={
                  post.nfts.length > 0
                    ? {
                        nftCanisterId: post.nfts[0].nftCanisterId,
                        nftTokenIndex: post.nfts[0].nftTokenIndex,
                        nftImageUrl: post.nfts[0].nftOriginalThumbnailUrl,
                      }
                    : undefined
                }
                clubId={post.clubId}
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
