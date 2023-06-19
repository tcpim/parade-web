import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../App";
import { useClubPostDetail } from "../../hooks/fetch-posts/useClubPostDetail";
import { useStreetPostDetail } from "../../hooks/fetch-posts/useStreetPostDetail";
import { useReplyClubPost } from "../../hooks/react-to-post/useReplyClubPost";
import { useReplyStreetPost } from "../../hooks/react-to-post/useReplyStreetPost";
import { getTimeperiod } from "../../utils/getTimePeriod";
import { NftImage } from "../Nft/NftImage";
import { Emojis } from "./Emojis";
import { PostRepliesMemo } from "./PostReplies";

interface PostDetailProps {
  postId: string;
  clubId?: string;
}

const PostDetail = ({ postId, clubId }: PostDetailProps) => {
  const appContext = useContext(AppContext);
  const streetQuery = useStreetPostDetail(postId, clubId === undefined);
  const clubQuery = useClubPostDetail(
    postId,
    clubId ?? "",
    clubId !== undefined
  );
  const query = clubId ? clubQuery : streetQuery;
  const [reply, setReply] = useState("");

  const streetMutation = useReplyStreetPost({
    postId: postId,
    words: reply,
    userPid: appContext.userLoginInfo.userPid,
  });
  const clubMutation = useReplyClubPost({
    postId: postId,
    words: reply,
    userPid: appContext.userLoginInfo.userPid,
    clubId: clubId ?? "",
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReply(event.target.value);
  };

  const handleReplySubmit = () => {
    clubId ? clubMutation.mutate() : streetMutation.mutate();
  };

  const isMutationLoading = () => {
    return clubId ? clubMutation.isLoading : streetMutation.isLoading;
  };

  if (query.isLoading) {
    return (
      <Box>
        <CircularProgress />
      </Box>
    );
  } else if (query.data === undefined || query.data?.post.length === 0) {
    return <h1>No post found</h1>;
  }

  const post = query.data.post[0];
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
      <Emojis postId={postId} emojis={post.emoji_reactions} clubId={clubId} />
      <Box display="flex" justifyContent="start" width="600px">
        <TextField
          id="reply"
          placeholder="Show your reaction!"
          fullWidth
          multiline
          onChange={handleInputChange}
        />
        {isMutationLoading() ? (
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
  let { clubId } = useParams();

  return (
    <Box sx={{ marginTop: "5%" }}>
      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem />}
        justifyContent="space-between"
        height="100vh"
        sx={{ marginTop: "5%" }}
      >
        <PostDetail postId={postId ?? "0"} clubId={clubId} />
      </Stack>
    </Box>
  );
};
