import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
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

interface ProfileProps {
  userId: string;
}

const UserPortfolioActivity = ({ userId }: ProfileProps) => {
  const [subPage, setSubPage] = useState<SubPage>("club-nfts");
  const appContext = useContext(AppContext);

  const isSelf = appContext.userLoginInfo.userPid === userId;

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

  const userInfoDiv = (userId: string) => {
    return (
      <UserInfoDiv>
        <UserAvatar canChange={isSelf} userId={userId} />
        <UserInfo userId={userId} />
      </UserInfoDiv>
    );
  };

  return (
    <Wrapper>
      {userInfoDiv(userId)}
      {subTabs()}
      {subPage === "club-nfts" && (
        <UserPortfolioMemo
          nftType="club"
          withImageFooter={true}
          userId={userId}
        />
      )}
      {subPage === "other-nfts" && (
        <UserPortfolioMemo
          nftType="other"
          withImageFooter={true}
          userId={userId}
        />
      )}
      {subPage === "posts" && <UserPostsMemo userPid={userId} />}
    </Wrapper>
  );
};

const CenteredDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 10rem;
  width: 100%;
`;
export const Profile = () => {
  const { userId } = useParams();
  const appContext = useContext(AppContext);

  let user = userId;
  if (user === undefined) {
    // /profile/ url without user id
    if (!appContext.userLoginInfo.walletConnected) {
      return (
        <CenteredDiv>
          <h1>Please connect your wallet</h1>
        </CenteredDiv>
      );
    } else {
      user = appContext.userLoginInfo.userPid;
    }
  }

  return <UserPortfolioActivity userId={user} />;
};
