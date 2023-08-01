import { Fragment, memo, useContext } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { styled } from "styled-components";
import { AppContext } from "../../App";
import { NftInfo } from "../../types/nft";
import { getAccountFromPrincipal } from "../../utils/principals";
import { UserClubCollectionListMemo } from "./UserClubCollectionList";
import { UserCollectionListDabMemo } from "./UserCollectionListDab";

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

interface ItemButtonProps {
  selected: boolean;
}
export const ItemButton = styled.button<ItemButtonProps>`
  border: none;
  background: none;
  align-self: flex-start;
  border-radius: 0.5rem;
  padding: 1.5rem;
  width: 100%;
  &:hover {
    background-color: rgba(255, 56, 92, 0.1);
  }
  ${(props) => props.selected && "background-color: rgba(255, 56, 92, 0.1);"}
`;

export const ImageCard = styled.div`
  margin-top: 0.5rem;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  position: relative;
  display: inline-block;
  &:hover .overlay {
    height: 40px; /* Adjust the height as per your needs */
  }
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
  &:hover {
    background-color: #d1d0d0;
  }
`;

export const ItemName = styled.h6`
  text-align: left;
  font-size: large;
  white-space: nowrap;
`;

export const ImageOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 0;
  background-color: rgba(255, 56, 92, 1);
  transition: height 0.3s;
  overflow: hidden;
`;

const ImageOverlayButton = styled.button`
  background: none;
  border: none;
  &:hover {
    cursor: pointer;
  }
`;

export const imageFooter = (
  token: NftInfo,
  handleButton: any,
  isSelf: boolean
) => {
  return (
    <ImageCardFooter>
      {token.collectionName + "#" + token.tokenIndex}
      <ImageCardFooterButton onClick={() => window.open(token.imageUrlOnChain)}>
        view onchain
      </ImageCardFooterButton>
      {isSelf && (
        <ImageCardFooterButton onClick={handleButton}>
          <AiOutlinePlus size={"1rem"} />
        </ImageCardFooterButton>
      )}
    </ImageCardFooter>
  );
};

export const imageOverlay = (token: NftInfo, handleButton: any) => {
  return (
    <ImageOverlay className="overlay">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <ImageOverlayButton onClick={() => handleButton(token)}>
          <h6 style={{ color: "white" }}>Select this NFT</h6>
        </ImageOverlayButton>
      </div>
    </ImageOverlay>
  );
};

export interface UserPortfolioProps {
  nftType: "club" | "other";
  withImageFooter?: boolean;
  withImageOverlay?: boolean;
  handleImageOverlayClick?: (nftInfo: NftInfo) => void;
  userId: string;
}

export const UserPortfolio = ({
  nftType,
  withImageFooter = false,
  withImageOverlay = false,
  handleImageOverlayClick,
  userId,
}: UserPortfolioProps) => {
  const appContext = useContext(AppContext);
  let isSelf = userId === appContext.userLoginInfo.userPid;

  return (
    <Fragment>
      {nftType === "club" && (
        <UserClubCollectionListMemo
          userAccount={getAccountFromPrincipal(userId)}
          withImageFooter={withImageFooter}
          withImageOverlay={withImageOverlay}
          handleImageOverlayClick={handleImageOverlayClick}
          isSelf={isSelf}
        />
      )}
      {nftType === "other" && (
        <UserCollectionListDabMemo
          userPid={userId}
          withImageFooter={withImageFooter}
          withImageOverlay={withImageOverlay}
          handleImageOverlayClick={handleImageOverlayClick}
          isSelf={isSelf}
        />
      )}
    </Fragment>
  );
};

export const UserPortfolioMemo = memo(UserPortfolio);
