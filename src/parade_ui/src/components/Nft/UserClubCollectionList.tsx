import { ExpandLess, ExpandMore } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import {
  Box,
  Button,
  CircularProgress,
  Collapse,
  List,
  ListItemButton,
  Stack,
  Typography,
} from "@mui/material";
import { memo, useEffect, useState } from "react";
import {
  Club,
  Token as ClubToken,
  useUserClubCollectionList,
} from "../../hooks/fetch-nft-data/useUserClubCollectionList";
import { PostCreationForm } from "../Post/PostCreationForm";
import { NftCard } from "./NftCard";
import { NftImage } from "./NftImage";
interface UserClubCollectionListProps {
  userAccount: string;
}

interface PostFormNftInfo extends ClubToken {
  canisterId: string;
  collectionName: string;
  clubId: string;
}

const UserClubCollectionList = ({
  userAccount,
}: UserClubCollectionListProps) => {
  const useUserClubCollectionListQuery = useUserClubCollectionList(userAccount);
  const [isExpanded, setIsExpanded] = useState<boolean[]>([]);
  const [openForm, setOpenForm] = useState<boolean>(false);
  const [postFormNftInfo, setPostFormNftInfo] = useState<PostFormNftInfo>({
    canisterId: "",
    collectionName: "",
    index: 0,
    identifier: "",
    image_url: "",
    thum_image_url: "",
    image_type: "",
    image_height_width_ratio: 0,
    image_url_onchain: "",
    clubId: "",
  });

  useEffect(() => {
    const clubExpandedState: boolean[] = new Array(
      useUserClubCollectionListQuery.data?.clubs.length
    ).fill(true);
    setIsExpanded(clubExpandedState);
  }, [userAccount, useUserClubCollectionListQuery.data]);

  const handleOpenForm = (club: Club, token: PostFormNftInfo) => {
    setOpenForm(true);
    setPostFormNftInfo({
      canisterId: token.canisterId,
      collectionName: token.collectionName,
      index: token.index,
      identifier: token.identifier,
      image_url: token.image_url,
      thum_image_url: token.thum_image_url,
      image_type: token.image_type,
      image_height_width_ratio: token.image_height_width_ratio,
      clubId: club.club_id,
      image_url_onchain: token.image_url_onchain,
    });
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  if (useUserClubCollectionListQuery.isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  } else if (useUserClubCollectionListQuery.isError) {
    throw new Error(
      "Failed to fetch userCollectionList from api: " +
        useUserClubCollectionListQuery.error.message
    );
  } else if (!useUserClubCollectionListQuery.data) {
    return <div>You don't have any club NFTs</div>;
  }

  const handleClubExpansionClick = (index: number) => {
    const newExpandedState = isExpanded.map((v, i) => {
      if (i == index) {
        return !v;
      } else {
        return v;
      }
    });
    setIsExpanded(newExpandedState);
  };

  const getClubTokenList = (clubId: string): Array<PostFormNftInfo> => {
    const club = useUserClubCollectionListQuery.data.clubs.filter(
      (club) => club.club_id === clubId
    )[0];
    return club.collections.flatMap((collection) => {
      return collection.ownedTokens.map((token) => {
        let res: PostFormNftInfo = {
          ...token,
          canisterId: collection.canisterId,
          collectionName: collection.collection_name,
          clubId: clubId,
        };

        return res;
      });
    });
  };

  return (
    <Box>
      <Typography variant="h3">Club NFTs</Typography>
      <List>
        {useUserClubCollectionListQuery.data.clubs.map((club: Club, index) => {
          return (
            <Box key={club.club_id}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h5">{club.club_name}</Typography>
                <ListItemButton
                  sx={{ maxWidth: "10%" }}
                  onClick={() => handleClubExpansionClick(index)}
                >
                  {isExpanded[index] ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
              </Box>
              <Collapse in={isExpanded[index]} timeout="auto">
                <Stack direction="row" sx={{ ml: 1, flexWrap: "wrap" }}>
                  {getClubTokenList(club.club_id).map((token) => (
                    <Box key={token.index}>
                      <NftCard
                        key={token.index.toString()}
                        index={token.index.toString()}
                      >
                        <NftImage
                          imageUrl={token.image_url}
                          width={500}
                          imageType={token.image_type}
                          imageHeightWidthRatio={token.image_height_width_ratio}
                        />{" "}
                      </NftCard>
                      <Button
                        size="small"
                        color="primary"
                        onClick={() => handleOpenForm(club, token)}
                      >
                        <AddIcon />
                      </Button>
                    </Box>
                  ))}
                </Stack>
              </Collapse>
            </Box>
          );
        })}
      </List>
      {openForm && (
        <PostCreationForm
          open={openForm}
          handleCloseForm={handleCloseForm}
          nftInfo={{
            canisterId: postFormNftInfo.canisterId,
            collectionName: postFormNftInfo.collectionName,
            tokenIndex: postFormNftInfo.index,
            tokenIdentifier: postFormNftInfo.identifier,
            imageUrl: postFormNftInfo.image_url,
            imageThumbnailUrl: postFormNftInfo.thum_image_url,
            imageType: postFormNftInfo.image_type,
            imageHeightWidthRatio: postFormNftInfo.image_height_width_ratio,
            clubId: postFormNftInfo.clubId,
          }}
          isPublicPost={true}
        />
      )}
    </Box>
  );
};

export const UserClubCollectionListMemo = memo(UserClubCollectionList);
