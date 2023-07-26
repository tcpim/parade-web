import { CircularProgress } from "@mui/material";
import { Fragment } from "react";
import { styled } from "styled-components";
import { useClubPostRepiles } from "../../hooks/fetch-posts/useClubPostReplies";
import { useStreetPostRepiles } from "../../hooks/fetch-posts/useStreetPostReplies";
import { useScrollToBottomAction } from "../../hooks/useScrollToBottomAction";
import { useGetUser } from "../../hooks/user/useGetUser";
import { NftInfo, converToNftInfo } from "../../types/nft";
import { getTimeperiod } from "../../utils/getTimePeriod";
import { truncateStr } from "../../utils/strings";
import { UserAvatar } from "../Profile/Avatar";
import { Emojis } from "./Emojis";

const ReplyCard = styled.div`
  margin-top: 1rem;
`;

const Header = styled.div`
  align-self: flex-start;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

interface PostRepliesProps {
  postId: string;
  clubId: string | undefined;
}

interface PostReplyCardProps {
  id: string;
  post_id: string;
  emoji_reactions: Array<[string, number]>;
  nfts: Array<NftInfo>;
  created_by: string;
  created_ts: bigint;
  words: string;
  clubId?: string;
}

const PostReplyCard = (reply: PostReplyCardProps) => {
  const userInfoQuery = useGetUser(reply.created_by ?? "");

  return (
    <ReplyCard>
      <Header>
        <UserAvatar size={30} userId={reply.created_by} />
        <h6>
          {truncateStr(
            userInfoQuery.data?.username ??
              userInfoQuery.data?.userId ??
              "unknow user",
            20
          )}
        </h6>
        <p>{getTimeperiod(reply.created_ts)}</p>
      </Header>
      <p>{reply.words}</p>
      <Emojis
        replyId={reply.id}
        emojis={reply.emoji_reactions}
        clubId={reply.clubId}
      />
    </ReplyCard>
  );
};

export const PostReplies = ({ postId, clubId }: PostRepliesProps) => {
  const streetQuery = useStreetPostRepiles(postId, clubId === undefined);
  const clubQuery = useClubPostRepiles(
    postId,
    clubId ?? "",
    clubId !== undefined
  );
  const query = clubId ? clubQuery : streetQuery;

  useScrollToBottomAction(
    document,
    () => {
      if (query.isFetchingNextPage) return;
      query.fetchNextPage();
    },
    200
  );

  if (query.isLoading) {
    return <CircularProgress />;
  } else if (query.status === "error" || query.data === undefined) {
    return <p>{query.error?.message}</p>;
  }

  return (
    <div>
      {query.data?.pages.map((page, index) => (
        <Fragment key={index}>
          {page.post_replies.map((reply) => (
            <Fragment key={reply.id}>
              <PostReplyCard
                {...{
                  id: reply.id,
                  post_id: reply.post_id,
                  emoji_reactions: reply.emoji_reactions,
                  nfts: reply.nfts.map((nft) => converToNftInfo(nft)),
                  created_by: reply.created_by,
                  created_ts: reply.created_ts,
                  words: reply.words,
                  clubId: clubId,
                }}
              />
            </Fragment>
          ))}
        </Fragment>
      ))}
    </div>
  );
};
