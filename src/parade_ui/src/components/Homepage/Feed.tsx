import { Autocomplete, Box, Button, Divider, TextField } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { DABCollection } from "@psychedelic/dab-js";
import { Fragment, useState } from "react";
import { useAllCollectionsDab } from "../../hooks/fetch-nft-data/useAllCollectionsDab";
import { useStreetCollectionPosts } from "../../hooks/fetch-posts/useStreetCollectionPosts";
import { useStreetPosts } from "../../hooks/fetch-posts/useStreetPosts";
import { useTrendingCollectionPosts } from "../../hooks/fetch-trending-posts/useTrendingCollectionPosts";
import { useTrendingStreetPosts } from "../../hooks/fetch-trending-posts/useTrendingStreetPosts";
import { useScrollToBottomAction } from "../../hooks/useScrollToBottomAction";
import { Post } from "../../types/post";
import { getTimeperiod } from "../../utils/getTimePeriod";
import { PostCard } from "../Post/PostCard";

export type SubPage = "recent" | "trending";

export const Feed = () => {
  const [subPage, setSubPage] = useState<SubPage>("recent");
  const [selectedCollection, setSelectedCollection] = useState("");
  const allCollectionQuery = useAllCollectionsDab();

  const streetPostsQuery = useStreetPosts(
    selectedCollection === "" && subPage === "recent"
  );
  const trendingStreetPostsQuery = useTrendingStreetPosts(
    selectedCollection === "" && subPage === "trending"
  );
  const collectionPostsQuery = useStreetCollectionPosts(
    selectedCollection,
    selectedCollection !== "" && subPage === "recent"
  );
  const trendingCollectionPostsQuery = useTrendingCollectionPosts(
    selectedCollection,
    selectedCollection !== "" && subPage === "trending"
  );

  let normallizedQuery: any = streetPostsQuery;
  if (selectedCollection === "" && subPage === "trending") {
    normallizedQuery = trendingStreetPostsQuery;
  } else if (selectedCollection !== "" && subPage === "recent") {
    normallizedQuery = collectionPostsQuery;
  } else if (selectedCollection !== "" && subPage === "trending") {
    normallizedQuery = trendingCollectionPostsQuery;
  }

  useScrollToBottomAction(
    document,
    () => {
      if (normallizedQuery.isFetchingNextPage) return;
      normallizedQuery.fetchNextPage();
    },
    200
  );

  if (normallizedQuery.isLoading) {
    return (
      <Box>
        <CircularProgress />
      </Box>
    );
  } else if (
    normallizedQuery.status === "error" ||
    normallizedQuery.data === undefined
  ) {
    return (
      <Typography color="error" align="center" variant="h6" gutterBottom>
        {normallizedQuery.error?.message}
      </Typography>
    );
  }

  const collections = allCollectionQuery.data ?? [];

  const handleCollectionSelect = (canisterId?: string) => {
    setSelectedCollection(canisterId ?? "");
    setSubPage("recent");
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      sx={{ marginLeft: "15%", marginTop: "5%", marginRight: "15%" }}
    >
      <Box>
        <Autocomplete
          color="primary"
          onChange={(event: any, newValue: DABCollection | null) => {
            handleCollectionSelect(newValue?.principal_id.toString());
          }}
          options={collections}
          getOptionLabel={(option) => option.name}
          renderInput={(params) => (
            <TextField {...params} label="Collection names" />
          )}
        />
      </Box>
      <Box display="flex" justifyContent="space-evenly" marginY={2}>
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
      {normallizedQuery.data.pages[0].posts.length === 0 && (
        <Typography align="center" variant="h6" gutterBottom marginTop={5}>
          There is no post in this collection yet
        </Typography>
      )}
      <Box alignItems="center">
        {normallizedQuery.data.pages.map((page: any, index: any) => (
          <Fragment key={index}>
            {page.posts.map((post: Post) => (
              <Fragment key={post.post_id}>
                <PostCard
                  postId={post.post_id}
                  createdBy={post.created_by}
                  timeAgo={getTimeperiod(post.created_ts)}
                  content={post.words}
                  replies={post.replies.length}
                  emojis={post.emoji_reactions}
                  nftInfo={{
                    nftCanisterId: post.nfts[0].nftCanisterId,
                    nftTokenIndex: post.nfts[0].nftTokenIndex,
                    nftImageUrl: post.nfts[0].nftOriginalThumbnailUrl,
                  }}
                  clubId={post.clubId}
                />
              </Fragment>
            ))}
          </Fragment>
        ))}

        {normallizedQuery.isFetchingNextPage && (
          <Box>
            <CircularProgress />
          </Box>
        )}
      </Box>
    </Box>
  );
};
