import { Box, Stack } from "@mui/material";
import TopBar from "../Topbar/TopBar";
import SideBar from "../Sidebar/SideBar";
import { Feed } from "./Feed";
import { LeaderBoard } from "./LeaderBoard";
import { useEffect, useState } from "react";
import {
  GetStreetPostsRequest,
  GetStreetPostsResponse,
  _SERVICE as MainServer,
} from "../../../backend_declarations/main_server/main_server.did";
import { useMainServer } from "../../hooks/useMainServer";
import Divider from "@mui/material/Divider";

const Homepage = () => {
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
        <Feed />
        <LeaderBoard />
      </Stack>
    </Box>
  );
};

export default Homepage;