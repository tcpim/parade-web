import { useUserCollectionList } from "../../hooks/fetch-nft-data/useUserCollectionList";
import { useContext, useEffect, useState } from "react";
import { Box } from "@mui/material";
import List from "@mui/material/List";
import Stack from "@mui/material/Stack";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import CircularProgress from "@mui/material/CircularProgress";
import {
  Collection,
  Token,
} from "../../hooks/fetch-nft-data/useUserCollectionList";
import { PostCreationForm } from "../Post/PostCreationForm";
import { NftInfo } from "./nft";
import { NftCard } from "./NftCard";

interface CollectionListProps {
  userAccount: string;
}

export const UserCollectionList = ({ userAccount }: CollectionListProps) => {
  const userCollectionQuery = useUserCollectionList(userAccount);

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

  const handleOpenForm = (collection: Collection, token: Token) => {
    setOpenForm(true);
    setPostFormNftInfo({
      nftCanisterId: collection.canisterId,
      nftCollectionName: collection.collectionName,
      nftTokenIndex: token.index,
      nftTokenIdentifier: token.identifier,
      nftOriginalImageUrl: token.originalImage,
      nftOriginalThumbnailUrl: token.smallImage,
    });
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  useEffect(() => {
    const collectionExpandedState: boolean[] = new Array(
      userCollectionQuery.data?.collections.length
    ).fill(true);
    setIsExpanded(collectionExpandedState);
  }, [userAccount, userCollectionQuery.data]);

  if (userCollectionQuery.isLoading) {
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
  } else if (userCollectionQuery.isError) {
    throw new Error(
      "Failed to fetch userCollectionList from api: " +
        userCollectionQuery.error.message
    );
  } else if (!userCollectionQuery.data) {
    return <div>No data is available</div>;
  }

  const handleCollectionExpansionClick = (index: number) => {
    const newExpandedState = isExpanded.map((v, i) => {
      if (i == index) {
        return !v;
      } else {
        return v;
      }
    });
    setIsExpanded(newExpandedState);
  };

  if (userCollectionQuery.data.collections.length == 0) {
    return <Box>You don't have any NFTs</Box>;
  }
  return (
    <Box>
      <List>
        {userCollectionQuery.data.collections.map((collection, index) => (
          <Box key={collection.canisterId}>
            <Box sx={{ display: "flex", justifyContent: "space-around" }}>
              <ListItemText
                primary={
                  collection.collectionName + ": " + collection.canisterId
                }
              />
              <ListItemButton
                sx={{ maxWidth: "10%" }}
                onClick={() => handleCollectionExpansionClick(index)}
              >
                {isExpanded[index] ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </Box>
            <Collapse in={isExpanded[index]} timeout="auto">
              <Stack direction="row" sx={{ ml: 1, flexWrap: "wrap" }}>
                {collection.tokens.map((token) => (
                  <Box key={token.index}>
                    <NftCard
                      key={token.index.toString()}
                      imageUrl={token.smallImage}
                      index={token.index.toString()}
                      canisterId={collection.canisterId}
                    />
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => handleOpenForm(collection, token)}
                    >
                      <AddIcon />
                    </Button>
                  </Box>
                ))}
              </Stack>
            </Collapse>
          </Box>
        ))}
      </List>
      {openForm && (
        <PostCreationForm
          open={openForm}
          handleCloseForm={handleCloseForm}
          nftInfo={postFormNftInfo}
        />
      )}
    </Box>
  );
};
