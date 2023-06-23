import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Typography,
} from "@mui/material";
import { Fragment, memo } from "react";
import { useClubPostRepiles } from "../../hooks/fetch-posts/useClubPostReplies";
import { useStreetPostRepiles } from "../../hooks/fetch-posts/useStreetPostReplies";
import { useScrollToBottomAction } from "../../hooks/useScrollToBottomAction";
import { NftInfo, converToNftInfo } from "../../types/nft";
import { getTimeperiod } from "../../utils/getTimePeriod";
import { Emojis } from "./Emojis";

interface PostRepliesProps {
  postId: string;
  clubId?: string;
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
  return (
    <Card sx={{ marginBottom: 3 }}>
      <CardContent>
        <Typography variant="subtitle1" gutterBottom>
          Replied by: {reply.created_by}
        </Typography>
        <Typography color="text.secondary" gutterBottom>
          {getTimeperiod(reply.created_ts)}
        </Typography>
        <Typography variant="body1" component="p">
          {reply.words}
        </Typography>
        <Typography variant="body2">
          <Emojis
            replyId={reply.id}
            emojis={reply.emoji_reactions}
            clubId={reply.clubId}
          />
        </Typography>
      </CardContent>
    </Card>
  );
};

const PostReplies = ({ postId, clubId }: PostRepliesProps) => {
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
    <Box>
      <CircularProgress />
    </Box>;
  } else if (query.status === "error" || query.data === undefined) {
    return (
      <Typography color="error" align="center" variant="h6" gutterBottom>
        {query.error?.message}
      </Typography>
    );
  }

  return (
    <Box>
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
    </Box>
  );
};

export const PostRepliesMemo = memo(PostReplies);
