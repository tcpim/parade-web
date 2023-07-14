import { Box, Button, Divider } from "@mui/material";
import { useContext, useState } from "react";
import { styled } from "styled-components";
import { AppContext } from "../../App";
import { UserPortfolioMemo } from "../Nft/UserPortfolio";
import { UserPostsMemo } from "../Post/UserPosts";
import { UserAvatar } from "./Avatar";
import { UserInfo } from "./UserInfo";

type SubPage = "portfolio" | "posts";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 3rem;
  margin-left: 5rem;
  margin-right: 15rem;
`;

const UserInfoDiv = styled.div`
  display: flex;
  align-items: center;
  margin-right: 4rem;
  margin-left: 4rem;
`;

/**
 * 
 * @returns         display="flex"
        justifyContent="center"
        marginLeft="10%"
        width="80%"
        marginBottom="20px"
 */
const UserPortfolioActivity = () => {
  const [subPage, setSubPage] = useState<SubPage>("portfolio");
  const appContext = useContext(AppContext);

  return (
    <Wrapper>
      <UserInfoDiv>
        <UserAvatar
          canChange={true}
          userId={appContext.userLoginInfo.userPid}
        />
        <UserInfo />
      </UserInfoDiv>
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
          loggedIn={appContext.userLoginInfo.walletConnected}
          userAccount={appContext.userLoginInfo.userAccount}
          userPid={appContext.userLoginInfo.userPid}
        />
      )}
      {subPage === "posts" && (
        <UserPostsMemo userPid={appContext.userLoginInfo.userPid} />
      )}
    </Wrapper>
  );
};

export const Profile = () => {
  return <UserPortfolioActivity />;
};
