import { Box, Stack } from "@mui/material";
import TopBar from "../Topbar/TopBar";
import SideBar from "../Sidebar/SideBar";
import { Feed } from "./Feed";
import { LeaderBoard } from "./LeaderBoard";
import Divider from "@mui/material/Divider";
import { useState } from "react";

const Homepage = () => {
  const [selectedCollection, setSelectedCollection] = useState("");

  return (
    <Box>
      <TopBar searchCollection={setSelectedCollection} />
      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem />}
        justifyContent="space-between"
        height="100vh"
        sx={{ marginTop: "5%" }}
      >
        <SideBar />
        <Feed canisterId={selectedCollection} />
        <LeaderBoard />
      </Stack>
    </Box>
  );
};

export default Homepage;
