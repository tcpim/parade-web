import { Autocomplete, TextField } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { DABCollection } from "@psychedelic/dab-js";
import { UseInfiniteQueryResult } from "@tanstack/react-query";
import { Fragment, useState } from "react";
import { styled } from "styled-components";
import { useAllCollectionsDab } from "../../hooks/fetch-nft-data/useAllCollectionsDab";
import { useStreetCollectionPosts } from "../../hooks/fetch-posts/useStreetCollectionPosts";
import { useStreetPosts } from "../../hooks/fetch-posts/useStreetPosts";
import { useTrendingCollectionPosts } from "../../hooks/fetch-trending-posts/useTrendingCollectionPosts";
import { useTrendingStreetPosts } from "../../hooks/fetch-trending-posts/useTrendingStreetPosts";
import { useScrollToBottomAction } from "../../hooks/useScrollToBottomAction";
import { Post } from "../../types/post";
import { SubTabButton, SubTabDiv } from "../CommonUI/SubTab";
import { PostCardMemo } from "../Post/PostCard";

export type SubPage = "recent" | "trending";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-left: 10%;
  margin-top: 5rem;
  margin-right: 20%;
`;

const CenteredDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20rem;
`;

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

  let normallizedQuery: UseInfiniteQueryResult<any, Error> = streetPostsQuery;
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
      <CenteredDiv>
        <CircularProgress />
      </CenteredDiv>
    );
  } else if (normallizedQuery.isError || normallizedQuery.data === undefined) {
    return (
      <CenteredDiv>
        <h6>Something went wrong</h6>
      </CenteredDiv>
    );
  }

  const collections = allCollectionQuery.data ?? [];

  const handleCollectionSelect = (canisterId?: string) => {
    setSelectedCollection(canisterId ?? "");
    setSubPage("recent");
  };

  const subTabs = () => {
    return (
      <SubTabDiv>
        <SubTabButton
          disabled={subPage === "recent"}
          selected={subPage === "recent"}
          onClick={() => setSubPage("recent")}
        >
          Recent
        </SubTabButton>

        <SubTabButton
          disabled={subPage === "trending"}
          selected={subPage === "trending"}
          onClick={() => setSubPage("trending")}
        >
          Trending
        </SubTabButton>
      </SubTabDiv>
    );
  };

  return (
    <Wrapper>
      <Autocomplete
        sx={{ width: "80%" }}
        color="primary"
        onChange={(event: any, newValue: DABCollection | null) => {
          handleCollectionSelect(newValue?.principal_id.toString());
        }}
        options={collections}
        getOptionLabel={(option) => option.name}
        renderInput={(params) => (
          <TextField {...params} label="Search collection names" />
        )}
      />
      {subTabs()}
      {normallizedQuery.data.pages[0].posts.length === 0 && (
        <h5 style={{ textAlign: "center", fontSize: "1rem" }}>
          There is no post in this collection yet
        </h5>
      )}

      {normallizedQuery.data.pages.map((page: any, index: any) => (
        <Fragment key={index}>
          {page.posts.map((post: Post) => (
            <Fragment key={post.postId}>
              <PostCardMemo post={post} />
            </Fragment>
          ))}
        </Fragment>
      ))}

      {normallizedQuery.isFetchingNextPage && (
        <div>
          <CircularProgress />
        </div>
      )}
    </Wrapper>
  );
};
