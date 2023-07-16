import { Box } from "@mui/material";
import { Fragment, memo } from "react";
import { styled } from "styled-components";
import { UserClubCollectionListMemo } from "./UserClubCollectionList";
import { UserCollectionListDabMemo } from "./UserCollectionListDab";

export interface UserPortfolioProps {
  userAccount?: string;
  userPid?: string;
  loggedIn: boolean;
  nftType: "club" | "other";
}

export const Wrapper = styled.div`
  display: flex;
  gap: 1rem;
`;

export const StyledItemList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  list-style-type: none;
  padding: 0;
  overflow-y: auto;
  max-height: 50vh;
`;

export const ImageList = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem, 0.5rem;
  justify-content: space-between;
  justify-items: center;
  align-items: center;
`;

export const ItemButton = styled.button`
  border: none;
  background: none;
  align-self: flex-start;
  border-radius: 0.5rem;
  padding: 1.5rem;
  width: 100%;
  &:hover {
    background-color: rgba(255, 56, 92, 0.1);
  }
`;

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
      {nftType === "other" && <UserCollectionListDabMemo userPid={userPid} />}
    </Fragment>
  );
};

export const UserPortfolioMemo = memo(UserPortfolio);
