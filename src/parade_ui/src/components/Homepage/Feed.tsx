import { Fragment } from "react";
import { useStreetPosts } from "../../hooks/useStreetPosts";
import { Box } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { PostCard } from "../Post/PostCard";
import { useScrollToBottomAction } from "../../hooks/useScrollToBottomAction";

export const Feed = () => {
  const streetPostsQuery = useStreetPosts();

  useScrollToBottomAction(
    document,
    () => {
      if (streetPostsQuery.isFetchingNextPage) return;
      streetPostsQuery.fetchNextPage();
    },
    200
  );

  if (streetPostsQuery.isLoading) {
    return (
      <Box>
        <CircularProgress />
      </Box>
    );
  } else if (
    streetPostsQuery.status === "error" ||
    streetPostsQuery.data === undefined
  ) {
    return (
      <Typography color="error" align="center" variant="h6" gutterBottom>
        {streetPostsQuery.error?.message}
      </Typography>
    );
  }

  return (
    <Box sx={{ marginLeft: "30%", marginRight: "auto", width: "100" }}>
      {streetPostsQuery.data.pages.map((page, index) => (
        <Fragment key={index}>
          {page.posts.map((post) => (
            <PostCard
              postId={post.id}
              createdBy={post.created_by}
              timeAgo={"5m"}
              content={post.words}
              replies={post.replies.length}
              nftCanisterId={post.nfts[0].canister_id}
              nftTokenIndex={post.nfts[0].token_index}
              nftImageUrl={post.nfts[0].original_thumbnail_url}
            />
          ))}
        </Fragment>
      ))}
      {streetPostsQuery.isFetchingNextPage && (
        <Box>
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
};
