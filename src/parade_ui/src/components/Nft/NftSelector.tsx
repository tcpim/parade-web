import AddIcon from "@mui/icons-material/Add";
import {
  Box,
  Fade,
  IconButton,
  ImageList,
  ImageListItem,
  Typography,
} from "@mui/material";
import { NFTCollection } from "@psychedelic/dab-js";
import { useContext, useState } from "react";
import { AppContext } from "../../App";
import {
  ClubCollectionListData,
  useUserClubCollectionList,
} from "../../hooks/fetch-nft-data/useUserClubCollectionList";
import { useUserCollectionListDab } from "../../hooks/fetch-nft-data/useUserCollectionListDab";
import { NftInfo } from "../../types/nft";
import { NftImage } from "./NftImage";

interface NftSelectorProps {
  onNftSelected: (nft: NftInfo) => void;
}

type HoverStateType = {
  [key: string]: boolean;
};

const getClubTokenList = (data?: ClubCollectionListData): Array<NftInfo> => {
  let tokens: Array<NftInfo> = [];
  if (!data) return tokens;

  for (let i = 0; i < data.clubs.length; i++) {
    for (let j = 0; j < data.clubs[i].collections.length; j++) {
      for (
        let k = 0;
        k < data.clubs[i].collections[j].ownedTokens.length;
        k++
      ) {
        tokens.push({
          canisterId: data.clubs[i].collections[j].canisterId,
          tokenIndex: data.clubs[i].collections[j].ownedTokens[k].index,
          tokenIdentifier:
            data.clubs[i].collections[j].ownedTokens[k].identifier,
          collectionName: data.clubs[i].collections[j].collection_name,
          imageUrl: data.clubs[i].collections[j].ownedTokens[k].image_url,
          imageThumbnailUrl:
            data.clubs[i].collections[j].ownedTokens[k].thum_image_url,
          imageType: data.clubs[i].collections[j].ownedTokens[k].image_type,
          imageHeightWidthRatio:
            data.clubs[i].collections[j].ownedTokens[k]
              .image_height_width_ratio,
          clubId: data.clubs[i].club_id,
        });
      }
    }
  }

  return tokens;
};

const getNonClubTokenList = (data?: NFTCollection[]): Array<NftInfo> => {
  let tokens: Array<NftInfo> = [];
  if (!data) return tokens;

  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].tokens.length; j++) {
      tokens.push({
        canisterId: data[i].canisterId,
        tokenIndex: Number(data[i].tokens[j].index),
        tokenIdentifier: data[i].tokens[j].id ?? "",
        collectionName: data[i].name,
        imageUrl: data[i].tokens[j].url,
        imageThumbnailUrl: data[i].tokens[j].url,
        imageType: "img",
        imageHeightWidthRatio: undefined,
        clubId: undefined,
      });
    }
  }

  return tokens;
};

export const NftSelector = ({ onNftSelected }: NftSelectorProps) => {
  const context = useContext(AppContext);
  const clubNftQuery = useUserClubCollectionList(
    context.userLoginInfo.userAccount
  );
  const otherNftQuery = useUserCollectionListDab(context.userLoginInfo.userPid);
  const [hovered, setHovered] = useState<HoverStateType>({});

  return (
    <Box marginLeft={5}>
      <Typography variant="h6">Club NFTs</Typography>
      <ImageList
        variant="quilted"
        sx={{ width: "100%%" }}
        cols={3}
        gap={30}
        rowHeight={400}
      >
        {getClubTokenList(clubNftQuery.data).map((token) => (
          <Box
            key={token.imageUrl}
            position="relative"
            onMouseEnter={() =>
              setHovered((prevState) => ({
                ...prevState,
                [token.tokenIdentifier]: true, // Toggle the boolean value
              }))
            }
            onMouseLeave={() =>
              setHovered((prevState) => ({
                ...prevState,
                [token.tokenIdentifier]: false, // Toggle the boolean value
              }))
            }
          >
            <ImageListItem
              key={token.imageUrl}
              sx={{ position: "relative", zIndex: hovered ? -1 : 0 }}
            >
              <NftImage
                imageUrl={token.imageUrl}
                width={500}
                imageType={token.imageType}
                imageHeightWidthRatio={token.imageHeightWidthRatio}
              />
            </ImageListItem>
            <Fade in={hovered[token.tokenIdentifier] ?? false}>
              <IconButton
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: "80%",
                  height: "80%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 1,
                  fontSize: "100px",
                  backgroundColor: "#8c8787",
                }}
                onClick={() => onNftSelected(token)}
              >
                <AddIcon sx={{ fontSize: "100px" }} />
              </IconButton>
            </Fade>
          </Box>
        ))}
      </ImageList>
      <Typography variant="h6">Other NFTs</Typography>
      <ImageList
        variant="quilted"
        sx={{ width: "100%%" }}
        cols={3}
        gap={30}
        rowHeight={400}
      >
        {getNonClubTokenList(otherNftQuery.data).map((token) => (
          <Box
            key={token.tokenIdentifier}
            position="relative"
            onMouseEnter={() =>
              setHovered((prevState) => ({
                ...prevState,
                [token.tokenIdentifier]: true, // Toggle the boolean value
              }))
            }
            onMouseLeave={() =>
              setHovered((prevState) => ({
                ...prevState,
                [token.tokenIdentifier]: false, // Toggle the boolean value
              }))
            }
          >
            <ImageListItem
              key={token.tokenIdentifier}
              sx={{ position: "relative", zIndex: hovered ? -1 : 0 }}
            >
              <NftImage
                imageUrl={token.imageUrl}
                width={500}
                imageType={token.imageType}
                imageHeightWidthRatio={token.imageHeightWidthRatio}
              />
            </ImageListItem>
            <Fade in={hovered[token.tokenIdentifier] ?? false}>
              <IconButton
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: "80%",
                  height: "80%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 1,
                  fontSize: "100px",
                  backgroundColor: "#8c8787",
                }}
                onClick={() => onNftSelected(token)}
              >
                <AddIcon sx={{ fontSize: "100px" }} />
              </IconButton>
            </Fade>
          </Box>
        ))}
      </ImageList>
    </Box>
  );
};
