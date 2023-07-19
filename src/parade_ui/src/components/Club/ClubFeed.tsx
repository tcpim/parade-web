import { CircularProgress } from "@mui/material";
import { Fragment, useState } from "react";
import { useParams } from "react-router-dom";
import { styled } from "styled-components";
import { useClubPosts } from "../../hooks/fetch-posts/useClubPosts";
import { useTrendingClubPosts } from "../../hooks/fetch-trending-posts/useTrendingClubPosts";
import { useScrollToBottomAction } from "../../hooks/useScrollToBottomAction";
import { Post } from "../../types/post";
import { SubTabButton, SubTabDiv } from "../CommonUI/SubTab";
import { PostCardMemo } from "../Post/PostCard";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-left: 10%;
  margin-right: 10%;
`;

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
      <div>
        <CircularProgress />
      </div>
    );
  } else if (
    normalizedQuery.status === "error" ||
    normalizedQuery.data === undefined
  ) {
    return <h5>{normalizedQuery.error?.message}</h5>;
  }

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
      {subTabs()}
      {normalizedQuery.data.pages[0].posts.length === 0 && (
        <h5 style={{ textAlign: "center", fontSize: "1rem" }}>
          There is no post in this club yet
        </h5>
      )}

      {normalizedQuery.data.pages.map((page: any, index: any) => (
        <Fragment key={index}>
          {page.posts.map((post: Post) => (
            <Fragment key={post.postId}>
              <PostCardMemo post={post} />
            </Fragment>
          ))}
        </Fragment>
      ))}

      {normalizedQuery.isFetchingNextPage && (
        <div>
          <CircularProgress />
        </div>
      )}
    </Wrapper>
  );
};
