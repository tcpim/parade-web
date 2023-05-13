import { Box, Stack } from "@mui/material";
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
  }
  //   else if (data?.post.length === 0 || data?.error) {
  //     return <h1>No post found</h1>;
  //   }
  return <h1>{data?.post[0]?.id}</h1>;
};

export const PostPage = () => {
  let { postId } = useParams();
  return (
    <Box>
      <TopBar />
      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem />}
        justifyContent="space-between"
        height="100vh"
        sx={{ marginTop: "5%" }}
      >
        <SideBar />
        <PostDetail postId={postId ?? "what"} />
        <LeaderBoard />
      </Stack>
    </Box>
  );
};
