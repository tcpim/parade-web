import { CircularProgress, Divider } from "@mui/material";
import { memo, useState } from "react";
import { styled } from "styled-components";
import {
  Club,
  ClubCollectionListData,
  Token,
  useUserClubCollectionList,
} from "../../hooks/fetch-nft-data/useUserClubCollectionList";
import { NftImage } from "./NftImage";

interface UserClubCollectionListProps {
  userAccount: string;
}

const StyledClubList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ImageList = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem, 0.5rem;
  justify-content: space-between;
  justify-items: center;
  align-items: center;
`;

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
    <div style={{ display: "flex", gap: "2rem" }}>
      <StyledClubList>
        <li>Total tokens: {query.data.tokenCount}</li>
        {clubs.map((club) => {
          return (
            <li>
              <div>
                <button
                  onClick={() => {
                    setCurrentClubId(club.club_id);
                  }}
                >
                  {club.club_name}
                </button>
              </div>
            </li>
          );
        })}
      </StyledClubList>
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
    </div>
  );
};

export const UserClubCollectionListMemo = memo(UserClubCollectionList);
