import { CircularProgress, Divider } from "@mui/material";
import { memo, useState } from "react";
import {
  Club,
  ClubCollectionListData,
  useUserClubCollectionList,
} from "../../hooks/fetch-nft-data/useUserClubCollectionList";
import { NftImage } from "./NftImage";
import {
  ImageCard,
  ImageList,
  ItemButton,
  ItemName,
  StyledItemList,
  Wrapper,
  imageFooter,
  imageOverlay,
} from "./UserPortfolio";

import { NftInfo, defaultNftInfo } from "../../types/nft";
import { PostCreationFormMemo } from "../Post/PostCreationForm";

const getClubNftInfoList = (
  clubId: string,
  clubs: ClubCollectionListData
): NftInfo[] => {
  const club = clubs.clubs.find((club) => club.club_id === clubId);
  if (!club) {
    return [];
  }

  const tokens: NftInfo[] = [];
  club.collections.forEach((collection) => {
    const nfts = collection.ownedTokens.map((token) => {
      const nftInfo: NftInfo = {
        canisterId: collection.canisterId,
        tokenIndex: token.index,
        tokenIdentifier: token.identifier,
        collectionName: collection.collection_name,
        imageUrl: token.image_url,
        imageUrlOnChain: token.image_url_onchain,
        imageThumbnailUrl: token.thum_image_url,
        imageType: token.image_type,
        imageHeightWidthRatio: token.image_height_width_ratio,
        clubId: club.club_id,
      };
      return nftInfo;
    });
    tokens.push(...nfts);
  });

  return tokens;
};

interface UserClubCollectionListProps {
  userAccount: string;
  withImageFooter?: boolean;
  withImageOverlay?: boolean;
  handleImageOverlayClick?: (nftInfo: NftInfo) => void;
  isSelf: boolean;
}

const UserClubCollectionList = ({
  userAccount,
  withImageFooter = false,
  withImageOverlay = true,
  handleImageOverlayClick,
  isSelf,
}: UserClubCollectionListProps) => {
  const query = useUserClubCollectionList(userAccount);
  const [currentClubId, setCurrentClubId] = useState("");
  const [openForm, setOpenForm] = useState<boolean>(false);
  const [postFormNftInfo, setPostFormNftInfo] =
    useState<NftInfo>(defaultNftInfo);

  const handleOpenForm = (nftInfo: NftInfo) => {
    setOpenForm(true);
    setPostFormNftInfo(nftInfo);
  };

  // check error cases
  if (query.isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </div>
    );
  } else if (query.isError) {
    throw new Error("Failed to get club NFTs: " + query.error.message);
  } else if (!query.data || query.data.tokenCount === 0) {
    return <div>You don't have any club NFTs</div>;
  }

  const clubs: Club[] = query.data.clubs;
  const displayedClub: string = currentClubId
    ? currentClubId
    : clubs[0].club_id;
  const clubTokenList: NftInfo[] = getClubNftInfoList(
    displayedClub,
    query.data
  );

  return (
    <Wrapper>
      <StyledItemList>
        {clubs.map((club) => {
          return (
            <li key={club.club_id}>
              <ItemButton
                onClick={() => setCurrentClubId(club.club_id)}
                selected={club.club_id === displayedClub}
              >
                <ItemName>{club.club_name}</ItemName>
                <p style={{ textAlign: "left" }}>
                  Owned: {getClubNftInfoList(club.club_id, query.data).length}
                </p>
              </ItemButton>
            </li>
          );
        })}
      </StyledItemList>
      <Divider orientation="vertical" flexItem />
      <ImageList>
        {clubTokenList.map((token) => {
          return (
            <ImageCard key={token.tokenIdentifier}>
              <NftImage
                imageUrl={token.imageUrl}
                width={300}
                imageType={token.imageType}
                imageHeightWidthRatio={token.imageHeightWidthRatio}
              />
              {withImageFooter &&
                imageFooter(token, () => handleOpenForm(token), isSelf)}
              {withImageOverlay && imageOverlay(token, handleImageOverlayClick)}
            </ImageCard>
          );
        })}
      </ImageList>
      {openForm && (
        <PostCreationFormMemo
          open={openForm}
          handleCloseForm={() => setOpenForm(false)}
          nftInfo={postFormNftInfo}
        />
      )}
    </Wrapper>
  );
};

export const UserClubCollectionListMemo = memo(UserClubCollectionList);
