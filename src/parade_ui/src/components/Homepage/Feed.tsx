import { Fragment } from "react";
import { useStreetPosts } from "../../hooks/fetch-posts/useStreetPosts";
import { Box } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { PostCard } from "../Post/PostCard";
import { useScrollToBottomAction } from "../../hooks/useScrollToBottomAction";
import { getTimeperiod } from "../../utils/getTimePeriod";
import { useCollectionPosts } from "../../hooks/fetch-posts/useCollectionPosts";

interface FeedProps {
  canisterId?: string;
}
export const Feed = ({ canisterId }: FeedProps) => {
  const streetPostsQuery = useStreetPosts(!!canisterId);
  const collectionPostsQuery = useCollectionPosts(canisterId, !canisterId);

  let queryRes = !canisterId ? streetPostsQuery : collectionPostsQuery;

  useScrollToBottomAction(
    document,
    () => {
      if (queryRes.isFetchingNextPage) return;
      queryRes.fetchNextPage();
    },
    200
  );

  if (queryRes.isLoading) {
    return (
      <Box>
        <CircularProgress />
      </Box>
    );
  } else if (queryRes.status === "error" || queryRes.data === undefined) {
    return (
      <Typography color="error" align="center" variant="h6" gutterBottom>
        {queryRes.error?.message}
      </Typography>
    );
  }

  return (
    <Box sx={{ marginLeft: "20%", marginRight: "auto", width: "100" }}>
      {queryRes.data.pages.map((page, index) => (
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
      {queryRes.isFetchingNextPage && (
        <Box>
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
};
