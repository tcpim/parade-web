import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Typography,
} from "@mui/material";
import { Fragment, useState } from "react";
import { useClubPosts } from "../../hooks/fetch-posts/useClubPosts";
import { useTrendingClubPosts } from "../../hooks/fetch-trending-posts/useTrendingClubPosts";
import { useScrollToBottomAction } from "../../hooks/useScrollToBottomAction";
import { getTimeperiod } from "../../utils/getTimePeriod";
import { PostCard } from "../Post/PostCard";

interface ClubFeedProps {
  clubId: string;
}

export type SubPage = "recent" | "trending";

export const ClubFeed = ({ clubId }: ClubFeedProps) => {
  const [subPage, setSubPage] = useState<SubPage>("recent");
  const clubPostsQuery = useClubPosts(clubId, subPage === "recent");
  const trendingClubPostsQuery = useTrendingClubPosts(
    clubId,
    subPage === "trending"
  );

  const normalizedQuery =
    subPage === "recent" ? clubPostsQuery : trendingClubPostsQuery;

  useScrollToBottomAction(
    document,
    () => {
      if (normalizedQuery.isFetchingNextPage) return;
      normalizedQuery.fetchNextPage();
    },
    200
  );

  if (clubId === "") {
    return <h1>invalid club id</h1>;
  } else if (normalizedQuery.isLoading) {
    return (
      <Box>
        <CircularProgress />
      </Box>
    );
  } else if (
    normalizedQuery.status === "error" ||
    normalizedQuery.data === undefined
  ) {
    return (
      <Typography color="error" align="center" variant="h6" gutterBottom>
        {normalizedQuery.error?.message}
      </Typography>
    );
  }

  return (
    <Box sx={{ marginLeft: "20%", marginRight: "auto", width: "100" }}>
      <Box display="flex" justifyContent="space-evenly">
        <Button
          disabled={subPage === "recent"}
          onClick={() => setSubPage("recent")}
        >
          Recent
        </Button>
        <Divider orientation="vertical" flexItem />
        <Button
          disabled={subPage === "trending"}
          onClick={() => setSubPage("trending")}
        >
          Trending
        </Button>
      </Box>
      {normalizedQuery.data.pages.map((page, index) => (
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
      {normalizedQuery.isFetchingNextPage && (
        <Box>
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
};
