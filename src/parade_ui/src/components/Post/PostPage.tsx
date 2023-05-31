import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../App";
import { usePostDetail } from "../../hooks/fetch-posts/usePostDetail";
import { useCreatePostReply } from "../../hooks/react-to-post/useCreatePostReply";
import { getTimeperiod } from "../../utils/getTimePeriod";
import { NftImage } from "../Nft/NftImage";
import { Emojis } from "./Emojis";
import { PostRepliesMemo } from "./PostReplies";

interface PostDetailProps {
  postId: string;
}

const PostDetail = ({ postId }: PostDetailProps) => {
  const appContext = useContext(AppContext);
  const postDetailQuery = usePostDetail(postId);
  const [reply, setReply] = useState("");

  const replyPostmutation = useCreatePostReply({
    postId: postId,
    words: reply,
    userPid: appContext.userLoginInfo.userPid,
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReply(event.target.value);
  };

  const handleReplySubmit = () => {
    replyPostmutation.mutate();
  };

  if (postDetailQuery.isLoading) {
    return (
      <Box>
        <CircularProgress />
      </Box>
    );
  } else if (
    postDetailQuery.data === undefined ||
    postDetailQuery.data?.post.length === 0
  ) {
    return <h1>No post found</h1>;
  }

  const post = postDetailQuery.data.post[0];
  return (
    <Box sx={{ marginLeft: "30%", marginRight: "auto", width: "100" }}>
      <Typography variant="h6" gutterBottom>
        Created by: {post?.created_by}
      </Typography>
      <Typography color="text.secondary">
        {getTimeperiod(post?.created_ts)}
      </Typography>
      {post.nfts.length > 0 && (
        <Box marginLeft="150px" maxWidth="350px">
          <NftImage
            imageUrl={post.nfts[0].original_thumbnail_url}
            canisterId={post.nfts[0].canister_id}
          />
        </Box>
      )}
      <Typography variant="h5" component="p">
        {post.words}
      </Typography>
      <Emojis postId={postId} emojis={post.emoji_reactions} />
      <Box display="flex" justifyContent="start" width="600px">
        <TextField
          id="reply"
          placeholder="Show your reaction!"
          fullWidth
          multiline
          onChange={handleInputChange}
        />
        {replyPostmutation.isLoading ? (
          <CircularProgress />
        ) : (
          <Button variant="contained" onClick={handleReplySubmit}>
            Reply
          </Button>
        )}
      </Box>
      <PostRepliesMemo postId={postId} />
    </Box>
  );
};

export const PostPage = () => {
  let { postId } = useParams();

  return (
    <Box sx={{ marginTop: "5%" }}>
      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem />}
        justifyContent="space-between"
        height="100vh"
        sx={{ marginTop: "5%" }}
      >
        <PostDetail postId={postId ?? "0"} />
      </Stack>
    </Box>
  );
};
