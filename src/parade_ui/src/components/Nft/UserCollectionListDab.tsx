import { CircularProgress, Divider } from "@mui/material";
import { NFTCollection } from "@psychedelic/dab-js";
import { memo, useState } from "react";
import { useUserCollectionListDab } from "../../hooks/fetch-nft-data/useUserCollectionListDab";
import { NftInfo, defaultNftInfo } from "../../types/nft";
import { PostCreationFormMemo } from "../Post/PostCreationForm";
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

const getCollectionNftInfoList = (
  collection: string,
  collections: NFTCollection[]
): NftInfo[] => {
  const tokens: NftInfo[] = [];
  const targetCollection = collections.find(
    (col) => col.canisterId === collection
  );
  if (!targetCollection) {
    return [];
  }

  const nfts = targetCollection.tokens.map((token) => {
    const nftInfo: NftInfo = {
      canisterId: targetCollection.canisterId,
      tokenIndex: Number(token.index),
      tokenIdentifier: token.id ?? "",
      collectionName: targetCollection.name,
      imageUrl: token.url,
      imageUrlOnChain: token.url,
      imageThumbnailUrl: token.url,
      imageType: "img",
      imageHeightWidthRatio: undefined,
      clubId: undefined,
    };
    return nftInfo;
  });
  tokens.push(...nfts);

  return tokens;
};

interface UserCollectionListDabProps {
  userPid: string;
  withImageFooter?: boolean;
  withImageOverlay?: boolean;
  handleImageOverlayClick?: (nftInfo: NftInfo) => void;
  isSelf: boolean;
}

const UserCollectionListDab = ({
  userPid,
  withImageFooter = false,
  withImageOverlay = false,
  handleImageOverlayClick,
  isSelf,
}: UserCollectionListDabProps) => {
  const query = useUserCollectionListDab(userPid);
  const [currentCollection, setCurrentCollection] = useState("");
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
  } else if (!query.data || query.data.length === 0) {
    return <div>You don't have any club NFTs</div>;
  }

  const collections: NFTCollection[] = query.data;
  const displayedCollection: string = currentCollection
    ? currentCollection
    : collections[0].canisterId;
  const collectionNftInfoList: NftInfo[] = getCollectionNftInfoList(
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
                <ItemName>{collection.name}</ItemName>
                <p style={{ textAlign: "left" }}>
                  Owned:
                  {
                    getCollectionNftInfoList(collection.canisterId, query.data)
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
        {collectionNftInfoList.map((token) => {
          return (
            <ImageCard>
              <NftImage
                imageUrl={token.imageUrl}
                width={300}
                imageType="img"
                imageHeightWidthRatio={undefined}
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
export const UserCollectionListDabMemo = memo(UserCollectionListDab);
