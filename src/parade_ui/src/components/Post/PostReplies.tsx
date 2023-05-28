import { Fragment, memo } from "react";
import { usePostRepiles } from "../../hooks/fetch-posts/usePostReplies";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Typography,
} from "@mui/material";
import { PostReply } from "../../../backend_declarations/main_server/main_server.did";
import { useScrollToBottomAction } from "../../hooks/useScrollToBottomAction";
import { getTimeperiod } from "../../utils/getTimePeriod";
import { Emojis } from "./Emojis";

interface PostRepliesProps {
  postId: string;
}

interface PostReplyCardProps {
  reply: PostReply;
}

const PostReplyCard = ({ reply }: PostReplyCardProps) => {
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
          <Emojis replyId={reply.id} emojis={reply.emoji_reactions} />
        </Typography>
      </CardContent>
    </Card>
  );
};

const PostReplies = ({ postId }: PostRepliesProps) => {
  const postRepliesQuery = usePostRepiles({ postId: postId });

  useScrollToBottomAction(
    document,
    () => {
      if (postRepliesQuery.isFetchingNextPage) return;
      postRepliesQuery.fetchNextPage();
    },
    200
  );

  if (postRepliesQuery.isLoading) {
    <Box>
      <CircularProgress />
    </Box>;
  } else if (
    postRepliesQuery.status === "error" ||
    postRepliesQuery.data === undefined
  ) {
    return (
      <Typography color="error" align="center" variant="h6" gutterBottom>
        {postRepliesQuery.error?.message}
      </Typography>
    );
  }

  return (
    <Box>
      {postRepliesQuery.data?.pages.map((page, index) => (
        <Fragment key={index}>
          {page.post_replies.map((reply) => (
            <Fragment key={reply.id}>
              <PostReplyCard reply={reply} />
            </Fragment>
          ))}
        </Fragment>
      ))}
    </Box>
  );
};

export const PostRepliesMemo = memo(PostReplies);
