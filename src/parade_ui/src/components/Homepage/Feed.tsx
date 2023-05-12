import { useState, useEffect, useContext } from "react";
import { useStreetPosts } from "../../hooks/useStreetPosts";
import { Box } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { PostCard } from "../Post/PostCard";
import { AppContext } from "../../App";

const PAGE_SIZE = 10;

export const Feed = () => {
  const appContext = useContext(AppContext);
  const [page, setPage] = useState(0);
  const { data, error, isLoading, isSuccess, isError } = useStreetPosts({
    offset: page * PAGE_SIZE,
    limit: PAGE_SIZE,
  });

  if (isLoading) {
    return (
      <Box>
        <CircularProgress />
      </Box>
    );
  } else if (isError) {
    return (
      <Typography color="error" align="center" variant="h6" gutterBottom>
        {error?.message}
      </Typography>
    );
  }

  return (
    <Box sx={{ marginLeft: "30%", marginRight: "auto", width: "100" }}>
      {data?.posts.map((post) => (
        <PostCard
          createdBy={post.created_by}
          timeAgo={"5m"}
          content={post.words}
          replies={post.replies.length}
          nftCanisterId={post.nfts[0].canister_id}
          nftTokenIndex={post.nfts[0].token_index}
        />
      ))}
    </Box>
  );
};
