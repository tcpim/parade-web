import { Fragment, memo, useContext, useEffect, useState } from "react";
import { Box } from "@mui/material";
import { UserCollectionList } from "./UserCollectionList";
import { UserCollectionListDab } from "./UserCollectionListDab";
import { UserClubCollectionListMemo } from "./UserClubCollectionList";

export interface UserPortfolioProps {
  userAccount?: string;
  userPid?: string;
}

const UserPortfolio = ({ userAccount, userPid }: UserPortfolioProps) => {
  if (userAccount === undefined || userPid === undefined) {
    return (
      <Box bgcolor="rgba(251, 18, 18, 0.2)">
        Please connect to wallet to see your portfolio
      </Box>
    );
  }

  return (
    <Fragment>
      <UserClubCollectionListMemo userAccount={userAccount} />
      <UserCollectionListDab userPid={userPid} />
    </Fragment>
  );
};

export const UserPortfolioMemo = memo(UserPortfolio);
