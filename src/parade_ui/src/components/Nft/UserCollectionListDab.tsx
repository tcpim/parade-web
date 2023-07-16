import { CircularProgress, Divider } from "@mui/material";
import { NFTCollection } from "@psychedelic/dab-js";
import { memo, useState } from "react";
import { useUserCollectionListDab } from "../../hooks/fetch-nft-data/useUserCollectionListDab";
import { NftImage } from "./NftImage";
import {
  ImageList,
  ItemButton,
  StyledItemList,
  Wrapper,
} from "./UserPortfolio";

interface UserCollectionListDabProps {
  userPid: string;
}

interface DabToken {
  image_url: string;
  index: number;
}

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

const UserCollectionListDab = ({ userPid }: UserCollectionListDabProps) => {
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
    <Wrapper>
      <StyledItemList>
        {collections.map((collection) => {
          return (
            <li>
              <ItemButton
                onClick={() => {
                  setCurrentCollection(collection.canisterId);
                }}
              >
                <h6 style={{ textAlign: "left", fontSize: "large" }}>
                  {collection.name}
                </h6>
                <p style={{ textAlign: "left" }}>
                  Owned:{" "}
                  {
                    getCollectionTokenList(collection.canisterId, query.data)
                      .length
                  }
                </p>
              </ItemButton>
            </li>
          );
        })}
      </StyledItemList>
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
    </Wrapper>
  );
};

export const UserCollectionListDabMemo = memo(UserCollectionListDab);
