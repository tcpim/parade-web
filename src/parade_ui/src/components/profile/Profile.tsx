import { Box, Button, Divider, Stack } from "@mui/material";
import { useContext, useState } from "react";
import { AppContext } from "../../App";
import { UserPortfolioMemo } from "../Nft/UserPortfolio";
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
        <UserPortfolioMemo
          userAccount={appContext.userLoginInfo.userAccount}
          userPid={appContext.userLoginInfo.userPid}
        />
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
      <Stack direction="row" justifyContent="space-between" height="100vh">
        <UserPortfolioActivity />
      </Stack>
    </Box>
  );
};
