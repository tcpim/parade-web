import { useState, useEffect, useContext, Fragment } from "react";
import { useStreetPosts } from "../../hooks/useStreetPosts";
import { Box } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { PostCard } from "../Post/PostCard";
import { AppContext } from "../../App";
import { useScrollToBottomAction } from "../../hooks/useScrollToBottomAction";

export const Feed = () => {
  const { data, error, status, fetchNextPage, isLoading, isFetchingNextPage } =
    useStreetPosts();

  useScrollToBottomAction(
    document,
    () => {
      if (isFetchingNextPage) return;
      fetchNextPage();
    },
    200
  );

  if (isLoading) {
    return (
      <Box>
        <CircularProgress />
      </Box>
    );
  } else if (status === "error") {
    return (
      <Typography color="error" align="center" variant="h6" gutterBottom>
        {error?.message}
      </Typography>
    );
  }

  return (
    <Box sx={{ marginLeft: "30%", marginRight: "auto", width: "100" }}>
      {data?.pages.map((page, index) => (
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
      {isFetchingNextPage && (
        <Box>
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
};
