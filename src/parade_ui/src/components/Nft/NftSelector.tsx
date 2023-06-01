import { Box, ImageList, ImageListItem, Typography } from "@mui/material";
import { useContext } from "react";
import { AppContext } from "../../App";
import {
  ClubCollectionListData,
  useUserClubCollectionList,
} from "../../hooks/fetch-nft-data/useUserClubCollectionList";
import { useUserCollectionListDab } from "../../hooks/fetch-nft-data/useUserCollectionListDab";
import { NftInfo } from "./nft";

export const NftSelector = () => {
  const context = useContext(AppContext);
  const clubNftQuery = useUserClubCollectionList(
    context.userLoginInfo.userAccount
  );
  const otherNftQuery = useUserCollectionListDab(context.userLoginInfo.userPid);

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

  return (
    <Box marginLeft={5}>
      <Typography variant="h6">Club NFTs</Typography>
      <ImageList
        variant="standard"
        sx={{ width: "80%" }}
        cols={3}
        gap={30}
        rowHeight={400}
      >
        {clubTokens(clubNftQuery.data).map((token) => (
          <ImageListItem key={token.nftOriginalThumbnailUrl}>
            <NftImage imageUrl={token.nftOriginalThumbnailUrl} />
          </ImageListItem>
        ))}
      </ImageList>
    </Box>
  );
};
