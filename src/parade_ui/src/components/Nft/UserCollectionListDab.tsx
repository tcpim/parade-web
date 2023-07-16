import { CircularProgress, Divider } from "@mui/material";
import { NFTCollection } from "@psychedelic/dab-js";
import { memo, useState } from "react";
import { styled } from "styled-components";
import { useUserCollectionListDab } from "../../hooks/fetch-nft-data/useUserCollectionListDab";
import { NftImage } from "./NftImage";

interface UserCollectionListDabProps {
  userPid: string;
}

interface DabToken {
  image_url: string;
  index: number;
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

const getCollectionTokenList = (
  collection: string,
  collections: NFTCollection[]
): DabToken[] => {
  const tokens: DabToken[] = [];
  const targetCollection = collections.find(
    (col) => col.canisterId === collection
  );
  if (!targetCollection) {
    return [];
  }

  targetCollection.tokens.forEach((token, index) => {
    const dabToken: DabToken = {
      image_url: token.url,
      index: Number(token.index),
    };
    tokens.push(dabToken);
  });

  return tokens;
};

const getTotalTokens = (collections: NFTCollection[]): number => {
  let totalTokens = 0;
  collections.forEach((collection) => {
    totalTokens += collection.tokens.length;
  });
  return totalTokens;
};

const UserCollectionListDab1 = ({ userPid }: UserCollectionListDabProps) => {
  const query = useUserCollectionListDab(userPid);
  const [currentCollection, setCurrentCollection] = useState("");

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
  } else if (!query.data || query.data.length === 0) {
    return <div>You don't have any club NFTs</div>;
  }

  const collections: NFTCollection[] = query.data;
  const displayedCollection: string = currentCollection
    ? currentCollection
    : collections[0].canisterId;
  const collectionTokenList: DabToken[] = getCollectionTokenList(
    displayedCollection,
    collections
  );

  return (
    <div style={{ display: "flex", gap: "2rem" }}>
      <StyledClubList>
        <li>Total tokens: {getTotalTokens(query.data)}</li>
        {collections.map((collection) => {
          return (
            <li>
              <div>
                <button
                  onClick={() => {
                    setCurrentCollection(collection.canisterId);
                  }}
                >
                  {collection.name}
                </button>
              </div>
            </li>
          );
        })}
      </StyledClubList>
      <Divider orientation="vertical" flexItem />
      <ImageList>
        {collectionTokenList.map((token) => {
          return (
            <NftImage
              imageUrl={token.image_url}
              width={300}
              imageType="img"
              imageHeightWidthRatio={undefined}
            />
          );
        })}
      </ImageList>
    </div>
  );
};

export const UserCollectionListDab1Memo = memo(UserCollectionListDab1);
