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
  gap: 1rem 0.5rem;
  justify-content: space-between;
  justify-items: center;
  align-items: start;
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

export const ImageCard = styled.div`
  padding-top: 0.5rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
`;

export const ImageCardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 4px 4px 8px rgb(137 132 132 / 44%);
`;

export const ImageCardFooterButton = styled.button`
  border: 1px solid transparent; /* Transparent border */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  background: none;
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
      <div style={{ backgroundColor: "rgba(251, 18, 18, 0.2)" }}>
        Please connect to wallet to see your portfolio
      </div>
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
