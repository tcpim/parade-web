import { Box, Stack } from "@mui/material";
import UserPortfolio from "./UserPortfolio";
import SideBar from "../Sidebar/SideBar";
import TopBar from "../Topbar/TopBar";

export const Profile = () => {
  return (
    <Box>
      <TopBar />
      <Stack direction="row" justifyContent="space-between" height="100vh">
        <SideBar />
        <UserPortfolio />
      </Stack>
    </Box>
  );
};
