import { Box, Container, Stack, Typography } from "@mui/material";
import TopBar from "../Topbar/TopBar";
import SideBar from "../Sidebar/SideBar";
import { LeaderBoard } from "../Homepage/LeaderBoard";
import Divider from "@mui/material/Divider";
import { useParams } from "react-router-dom";
import { usePostDetail } from "../../hooks/usePostDetail";
import CircularProgress from "@mui/material/CircularProgress";

interface PostDetailProps {
  postId: string;
}

const PostDetail = ({ postId }: PostDetailProps) => {
  const { isLoading, isSuccess, isError, data } = usePostDetail(postId);
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
