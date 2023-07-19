import { useContext, useState } from "react";
import { styled } from "styled-components";
import { AppContext } from "../../App";
import { SubTabButton, SubTabDiv } from "../CommonUI/SubTab";
import { UserPortfolioMemo } from "../Nft/UserPortfolio";
import { UserPostsMemo } from "../Post/UserPosts";
import { UserAvatar } from "./Avatar";
import { UserInfo } from "./UserInfo";

type SubPage = "club-nfts" | "other-nfts" | "posts";

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

const UserPortfolioActivity = () => {
  const [subPage, setSubPage] = useState<SubPage>("club-nfts");
  const appContext = useContext(AppContext);

  const subTabs = () => {
    return (
      <SubTabDiv>
        <SubTabButton
          disabled={subPage === "club-nfts"}
          selected={subPage === "club-nfts"}
          onClick={() => setSubPage("club-nfts")}
        >
          Club NFTs
        </SubTabButton>

        <SubTabButton
          disabled={subPage === "other-nfts"}
          selected={subPage === "other-nfts"}
          onClick={() => setSubPage("other-nfts")}
        >
          Other NFTs
        </SubTabButton>
        <SubTabButton
          disabled={subPage === "posts"}
          selected={subPage === "posts"}
          onClick={() => setSubPage("posts")}
        >
          User Posts
        </SubTabButton>
      </SubTabDiv>
    );
  };

  const userInfoDiv = () => {
    return (
      <UserInfoDiv>
        <UserAvatar
          canChange={true}
          userId={appContext.userLoginInfo.userPid}
        />
        <UserInfo />
      </UserInfoDiv>
    );
  };
  return (
    <Wrapper>
      {userInfoDiv()}
      {subTabs()}
      {subPage === "club-nfts" && (
        <UserPortfolioMemo nftType="club" withImageFooter={true} />
      )}
      {subPage === "other-nfts" && (
        <UserPortfolioMemo nftType="other" withImageFooter={true} />
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
