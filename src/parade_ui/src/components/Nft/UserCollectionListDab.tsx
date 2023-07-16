import { CircularProgress, Divider } from "@mui/material";
import { NFTCollection } from "@psychedelic/dab-js";
import { memo, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { useUserCollectionListDab } from "../../hooks/fetch-nft-data/useUserCollectionListDab";
import { NftInfo, defaultNftInfo } from "../../types/nft";
import { PostCreationForm } from "../Post/PostCreationForm";
import { NftImage } from "./NftImage";
import {
  ImageCard,
  ImageCardFooter,
  ImageCardFooterButton,
  ImageList,
  ItemButton,
  ItemName,
  StyledItemList,
  Wrapper,
} from "./UserPortfolio";

interface UserCollectionListDabProps {
  userPid: string;
}

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

const UserCollectionListDab = ({ userPid }: UserCollectionListDabProps) => {
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
                  Owned: {collectionNftInfoList.length}
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
              <ImageCardFooter>
                {"#" + token.tokenIndex}
                <ImageCardFooterButton
                  onClick={() => window.open(token.imageUrlOnChain)}
                >
                  view onchain
                </ImageCardFooterButton>
                <ImageCardFooterButton onClick={() => handleOpenForm(token)}>
                  <AiOutlinePlus size={"1rem"} />
                </ImageCardFooterButton>
              </ImageCardFooter>
            </ImageCard>
          );
        })}
      </ImageList>
      {openForm && (
        <PostCreationForm
          open={openForm}
          handleCloseForm={() => setOpenForm(false)}
          nftInfo={postFormNftInfo}
        />
      )}
    </Wrapper>
  );
};
export const UserCollectionListDabMemo = memo(UserCollectionListDab);
