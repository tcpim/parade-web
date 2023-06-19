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

const clubTokens = (data?: ClubCollectionListData): Array<NftInfo> => {
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
          nftCanisterId: data.clubs[i].collections[j].canisterId,
          nftTokenIndex: data.clubs[i].collections[j].ownedTokens[k].index,
          nftTokenIdentifier:
            data.clubs[i].collections[j].ownedTokens[k].identifier,
          nftCollectionName: data.clubs[i].collections[j].collection_name,
          nftOriginalImageUrl:
            data.clubs[i].collections[j].ownedTokens[k].originalImage,
          nftOriginalThumbnailUrl:
            data.clubs[i].collections[j].ownedTokens[k].smallImage,
          clubId: data.clubs[i].club_id,
        });
      }
    }
  }

  return tokens;
};

const otherTokens = (data?: NFTCollection[]): Array<NftInfo> => {
  let tokens: Array<NftInfo> = [];
  if (!data) return tokens;

  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].tokens.length; j++) {
      tokens.push({
        nftCanisterId: data[i].canisterId,
        nftTokenIndex: Number(data[i].tokens[j].index),
        nftTokenIdentifier: data[i].tokens[j].id ?? "",
        nftCollectionName: data[i].name,
        nftOriginalImageUrl: "",
        nftOriginalThumbnailUrl: data[i].tokens[j].url,
        clubId: "",
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

  const getImageUrl = (token: NftInfo): string => {
    if (token.nftCanisterId === "4ggk4-mqaaa-aaaae-qad6q-cai") {
      return token.nftOriginalImageUrl;
    } else {
      return token.nftOriginalThumbnailUrl;
    }
  };
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
        {clubTokens(clubNftQuery.data).map((token) => (
          <Box
            key={token.nftOriginalThumbnailUrl}
            position="relative"
            onMouseEnter={() =>
              setHovered((prevState) => ({
                ...prevState,
                [token.nftTokenIdentifier]: true, // Toggle the boolean value
              }))
            }
            onMouseLeave={() =>
              setHovered((prevState) => ({
                ...prevState,
                [token.nftTokenIdentifier]: false, // Toggle the boolean value
              }))
            }
          >
            <ImageListItem
              key={token.nftOriginalThumbnailUrl}
              sx={{ position: "relative", zIndex: hovered ? -1 : 0 }}
            >
              <NftImage
                imageUrl={getImageUrl(token)}
                canisterId={token.nftCanisterId}
              />
            </ImageListItem>
            <Fade in={hovered[token.nftTokenIdentifier] ?? false}>
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
        {otherTokens(otherNftQuery.data).map((token) => (
          <Box
            key={token.nftOriginalThumbnailUrl}
            position="relative"
            onMouseEnter={() =>
              setHovered((prevState) => ({
                ...prevState,
                [token.nftTokenIdentifier]: true, // Toggle the boolean value
              }))
            }
            onMouseLeave={() =>
              setHovered((prevState) => ({
                ...prevState,
                [token.nftTokenIdentifier]: false, // Toggle the boolean value
              }))
            }
          >
            <ImageListItem
              key={token.nftOriginalThumbnailUrl}
              sx={{ position: "relative", zIndex: hovered ? -1 : 0 }}
            >
              <NftImage
                imageUrl={getImageUrl(token)}
                canisterId={token.nftCanisterId}
              />
            </ImageListItem>
            <Fade in={hovered[token.nftTokenIdentifier] ?? false}>
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
