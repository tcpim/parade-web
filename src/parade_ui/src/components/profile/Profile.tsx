import { Box, Button, Divider, Stack } from "@mui/material";
import { UserPortfolioMemo } from "../Nft/UserPortfolio";
import SideBar from "../Sidebar/SideBar";
import TopBar from "../Topbar/TopBar";
import { useContext, useState } from "react";
import { AppContext } from "../../App";
import { UserPostsMemo } from "../Post/UserPosts";

type SubPage = "portfolio" | "posts";

const UserPortfolioActivity = () => {
  const [subPage, setSubPage] = useState<SubPage>("portfolio");
  const appContext = useContext(AppContext);

  return (
    <Box sx={{ marginLeft: "15%", marginTop: "5%", width: "80%" }}>
      <Box display="flex" justifyContent="space-evenly">
        <Button
          disabled={subPage === "portfolio"}
          onClick={() => setSubPage("portfolio")}
        >
          Portfolio
        </Button>
        <Divider orientation="vertical" flexItem />
        <Button
          disabled={subPage === "posts"}
          onClick={() => setSubPage("posts")}
        >
          Posts
        </Button>
      </Box>
      {subPage === "portfolio" && (
        <UserPortfolioMemo userAccount={appContext.userLoginInfo.userAccount} />
      )}
      {subPage === "posts" && (
        <UserPostsMemo userPid={appContext.userLoginInfo.userPid} />
      )}
    </Box>
  );
};

export const Profile = () => {
  return (
    <Box>
      <TopBar />
      <Stack direction="row" justifyContent="space-between" height="100vh">
        <SideBar />
        <UserPortfolioActivity />
      </Stack>
    </Box>
  );
};
