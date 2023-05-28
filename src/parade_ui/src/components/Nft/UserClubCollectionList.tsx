import {
  Box,
  Button,
  CircularProgress,
  Collapse,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {
  Club,
  Token,
  useUserClubCollectionList,
} from "../../hooks/useUserClubCollectionList";
import { memo, useEffect, useState } from "react";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { NftCard } from "./NftCard";
import { canisterId } from "../../../backend_declarations/main_server";
import { NftInfo } from "./nft";
import { PostCreationForm } from "../Post/PostCreationForm";

interface UserClubCollectionListProps {
  userAccount: string;
}

const UserClubCollectionList = ({
  userAccount,
}: UserClubCollectionListProps) => {
  const useUserClubCollectionListQuery = useUserClubCollectionList(userAccount);
  const [isExpanded, setIsExpanded] = useState<boolean[]>([]);
  const [openForm, setOpenForm] = useState<boolean>(false);
  const [postFormNftInfo, setPostFormNftInfo] = useState<NftInfo>({
    nftCanisterId: "",
    nftCollectionName: "",
    nftTokenIndex: 0,
    nftTokenIdentifier: "",
    nftOriginalImageUrl: "",
    nftOriginalThumbnailUrl: "",
  });

  useEffect(() => {
    const clubExpandedState: boolean[] = new Array(
      useUserClubCollectionListQuery.data?.clubs.length
    ).fill(true);
    setIsExpanded(clubExpandedState);
  }, [userAccount, useUserClubCollectionListQuery.data]);

  const handleOpenForm = (club: Club, token: any) => {
    setOpenForm(true);
    setPostFormNftInfo({
      nftCanisterId: token.canisterId,
      nftCollectionName: token.collectionName,
      nftTokenIndex: token.index,
      nftTokenIdentifier: token.identifier,
      nftOriginalImageUrl: token.originalImage,
      nftOriginalThumbnailUrl: token.smallImage,
      clubId: club.club_id,
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

  const clubTokens = (clubId: string) => {
    const club = useUserClubCollectionListQuery.data.clubs.filter(
      (club) => club.club_id === clubId
    )[0];
    return club.collections.flatMap((collection) => {
      return collection.ownedTokens.map((token) => {
        return {
          ...token,
          canisterId: collection.canisterId,
          collectionName: collection.collection_name,
        };
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
                  {clubTokens(club.club_id).map((token) => (
                    <Box key={token.index}>
                      <NftCard
                        key={token.index.toString()}
                        imageUrl={token.smallImage}
                        index={token.index.toString()}
                        canisterId={token.canisterId}
                      />
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
          nftInfo={postFormNftInfo}
          isPublicPost={true}
        />
      )}
    </Box>
  );
};

export const UserClubCollectionListMemo = memo(UserClubCollectionList);
