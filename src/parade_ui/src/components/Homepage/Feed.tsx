import { Autocomplete, Box, Button, Divider, TextField } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { DABCollection } from "@psychedelic/dab-js";
import { Fragment, useState } from "react";
import { Post } from "../../../backend_declarations/main_server/main_server.did";
import { useAllCollectionsDab } from "../../hooks/fetch-nft-data/useAllCollectionsDab";
import { useCollectionPosts } from "../../hooks/fetch-posts/useCollectionPosts";
import { useStreetPosts } from "../../hooks/fetch-posts/useStreetPosts";
import { useTrendingCollectionPosts } from "../../hooks/fetch-trending-posts/useTrendingCollectionPosts";
import { useTrendingStreetPosts } from "../../hooks/fetch-trending-posts/useTrendingStreetPosts";
import { useScrollToBottomAction } from "../../hooks/useScrollToBottomAction";
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
  const collectionPostsQuery = useCollectionPosts(
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
    <Box sx={{ marginLeft: "20%", marginRight: "20%", width: "100%" }}>
      <Box sx={{ width: "100%" }}>
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
      {normallizedQuery.data.pages.map((page: any, index: any) => (
        <Fragment key={index}>
          {page.posts.map((post: Post) => (
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
      {normallizedQuery.isFetchingNextPage && (
        <Box>
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
};
