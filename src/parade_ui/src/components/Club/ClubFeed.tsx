import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Typography,
} from "@mui/material";
import { Fragment, useState } from "react";
import { useParams } from "react-router-dom";
import { useClubPosts } from "../../hooks/fetch-posts/useClubPosts";
import { useTrendingClubPosts } from "../../hooks/fetch-trending-posts/useTrendingClubPosts";
import { useScrollToBottomAction } from "../../hooks/useScrollToBottomAction";
import { PostCardMemo } from "../Post/PostCard";

export type SubPage = "recent" | "trending";

export const ClubFeed = () => {
  let { clubId = "" } = useParams();
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
    <Fragment>
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
      <Box alignItems="center">
        {normalizedQuery.data.pages.map((page, index) => (
          <Fragment key={index}>
            {page.posts.map((post) => (
              <Fragment key={post.postId}>
                <PostCardMemo post={post} />
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
    </Fragment>
  );
};
