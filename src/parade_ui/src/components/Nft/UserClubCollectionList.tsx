import { CircularProgress, Divider } from "@mui/material";
import { memo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Club,
  ClubCollectionListData,
  Token,
  useUserClubCollectionList,
} from "../../hooks/fetch-nft-data/useUserClubCollectionList";
import { NftImage } from "./NftImage";
import {
  ImageList,
  ItemButton,
  StyledItemList,
  Wrapper,
} from "./UserPortfolio";

interface UserClubCollectionListProps {
  userAccount: string;
}

const getClubTokenList = (
  clubId: string,
  clubs: ClubCollectionListData
): Token[] => {
  const club = clubs.clubs.find((club) => club.club_id === clubId);
  if (!club) {
    return [];
  }

  const tokens: Token[] = [];
  club.collections.forEach((collection) => {
    tokens.push(...collection.ownedTokens);
  });

  return tokens;
};

const UserClubCollectionList = ({
  userAccount,
}: UserClubCollectionListProps) => {
  const query = useUserClubCollectionList(userAccount);
  const [currentClubId, setCurrentClubId] = useState("");
  const navigate = useNavigate();

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
  const clubTokenList: Token[] = getClubTokenList(displayedClub, query.data);

  return (
    <Wrapper>
      <StyledItemList>
        {clubs.map((club) => {
          return (
            <li>
              <ItemButton onClick={() => setCurrentClubId(club.club_id)}>
                <h6 style={{ textAlign: "left", fontSize: "large" }}>
                  {club.club_name}
                </h6>
                <p style={{ textAlign: "left" }}>
                  Owned: {getClubTokenList(club.club_id, query.data).length}
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
            <NftImage
              imageUrl={token.image_url}
              width={300}
              imageType={token.image_type}
              imageHeightWidthRatio={token.image_height_width_ratio}
            />
          );
        })}
      </ImageList>
    </Wrapper>
  );
};

export const UserClubCollectionListMemo = memo(UserClubCollectionList);
