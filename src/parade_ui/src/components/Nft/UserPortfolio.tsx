import { Box } from "@mui/material";
import { Fragment, memo } from "react";
import { UserClubCollectionListMemo } from "./UserClubCollectionList";
import { UserCollectionListDab } from "./UserCollectionListDab";

export interface UserPortfolioProps {
  userAccount?: string;
  userPid?: string;
  loggedIn: boolean;
  nftType: "club" | "other";
}

export const UserPortfolio = ({
  userAccount,
  userPid,
  loggedIn,
  nftType,
}: UserPortfolioProps) => {
  console.log(`userAccount: ${userAccount}, userPid: ${userPid}`);

  if (!loggedIn || !userAccount || !userPid) {
    return (
      <Box bgcolor="rgba(251, 18, 18, 0.2)">
        Please connect to wallet to see your portfolio
      </Box>
    );
  }

  return (
    <Fragment>
      {nftType === "club" && (
        <UserClubCollectionListMemo userAccount={userAccount} />
      )}
      {nftType === "other" && <UserCollectionListDab userPid={userPid} />}
    </Fragment>
  );
};

export const UserPortfolioMemo = memo(UserPortfolio);
