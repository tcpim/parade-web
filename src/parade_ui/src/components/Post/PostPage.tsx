import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import TopBar from "../Topbar/TopBar";
import SideBar from "../Sidebar/SideBar";
import { LeaderBoard } from "../Homepage/LeaderBoard";
import Divider from "@mui/material/Divider";
import { useParams } from "react-router-dom";
import { usePostDetail } from "../../hooks/usePostDetail";
import CircularProgress from "@mui/material/CircularProgress";
import { NftImage } from "../Nft/NftImage";
import { useCreatePostReply } from "../../hooks/useCreatePostReply";
import { useContext } from "react";
import { AppContext } from "../../App";

interface PostDetailProps {
  postId: string;
}

const PostDetail = ({ postId }: PostDetailProps) => {
  const appContext = useContext(AppContext);

  const { isLoading, isSuccess, isError, data } = usePostDetail(postId);
  const replyPostmutation = useCreatePostReply({
    postId: postId,
    words: "test reply!",
    userPid: appContext.userLoginInfo.userPid,
  });

  const handleReplySubmit = () => {
    replyPostmutation.mutate();
  };

  if (isLoading) {
    return (
      <Box>
        <CircularProgress />
      </Box>
    );
  } else if (data === undefined || data?.post.length === 0) {
    return <h1>No post found</h1>;
  }

  const post = data.post[0];
  return (
    <Container sx={{ marginLeft: "30%", marginRight: "auto", width: "100" }}>
      <Typography variant="h6" gutterBottom>
        Created by: {post?.created_by}
      </Typography>
      <Box marginLeft="150px" maxWidth="350px">
        <NftImage
          imageUrl={post?.nfts[0].original_thumbnail_url}
          canisterId={post.nfts[0].canister_id}
        />
      </Box>
      <Typography variant="h5" component="p">
        {post.words}
      </Typography>
      <Box display="flex" justifyContent="start" width="600px">
        <TextField
          id="reply"
          placeholder="Show your reaction!"
          fullWidth
          multiline
        />
        <Button variant="contained" onClick={handleReplySubmit}>
          Reply
        </Button>
      </Box>
    </Container>
  );
};

export const PostPage = () => {
  let { postId } = useParams();

  return (
    <Box sx={{ marginTop: "5%" }}>
      <TopBar />
      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem />}
        justifyContent="space-between"
        height="100vh"
        sx={{ marginTop: "5%" }}
      >
        <SideBar />
        <PostDetail postId={postId ?? "0"} />
        <LeaderBoard />
      </Stack>
    </Box>
  );
};
