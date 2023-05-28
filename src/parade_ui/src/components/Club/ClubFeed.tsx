import { Box, CircularProgress, Typography } from "@mui/material";
import { useClubPosts } from "../../hooks/fetch-posts/useClubPosts";
import { useScrollToBottomAction } from "../../hooks/useScrollToBottomAction";
import { Fragment } from "react";
import { PostCard } from "../Post/PostCard";
import { getTimeperiod } from "../../utils/getTimePeriod";

interface ClubFeedProps {
  clubId: string;
}

export const ClubFeed = ({ clubId }: ClubFeedProps) => {
  const clubPostsQuery = useClubPosts(clubId);

  useScrollToBottomAction(
    document,
    () => {
      if (clubPostsQuery.isFetchingNextPage) return;
      clubPostsQuery.fetchNextPage();
    },
    200
  );

  if (clubId === "") {
    return <h1>invalid club id</h1>;
  } else if (clubPostsQuery.isLoading) {
    return (
      <Box>
        <CircularProgress />
      </Box>
    );
  } else if (
    clubPostsQuery.status === "error" ||
    clubPostsQuery.data === undefined
  ) {
    return (
      <Typography color="error" align="center" variant="h6" gutterBottom>
        {clubPostsQuery.error?.message}
      </Typography>
    );
  }

  return (
    <Box sx={{ marginLeft: "30%", marginRight: "auto", width: "100" }}>
      {clubPostsQuery.data.pages.map((page, index) => (
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
      {clubPostsQuery.isFetchingNextPage && (
        <Box>
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
};
