import { memo, useContext, useEffect, useState } from "react";
import { Box } from "@mui/material";
import { UserCollectionList } from "./UserCollectionList";

export interface UserPortfolioProps {
  userAccount?: string;
}

const UserPortfolio = ({ userAccount }: UserPortfolioProps) => {
  if (userAccount === undefined) {
    return (
      <Box bgcolor="rgba(251, 18, 18, 0.2)">
        Please connect to wallet to see your portfolio
      </Box>
    );
  }

  return (
    <Box bgcolor="rgba(251, 18, 18, 0.2)">
      <UserCollectionList userAccount={userAccount} />
    </Box>
  );
};

export const UserPortfolioMemo = memo(UserPortfolio);
