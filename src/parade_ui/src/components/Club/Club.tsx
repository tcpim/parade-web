import { Box, Divider, Stack } from "@mui/material";
import { useParams } from "react-router-dom";
import TopBar from "../Topbar/TopBar";
import SideBar from "../Sidebar/SideBar";
import { LeaderBoard } from "../Homepage/LeaderBoard";
import { ClubFeed } from "./ClubFeed";

export const Club = () => {
  let { clubId } = useParams();

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
        <ClubFeed clubId={clubId ?? ""} />
        <LeaderBoard />
      </Stack>
    </Box>
  );
};
