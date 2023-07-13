import AddIcon from "@mui/icons-material/Add";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { NFTCollection, NFTDetails } from "@psychedelic/dab-js";
import { useEffect, useState } from "react";
import { useUserCollectionListDab } from "../../hooks/fetch-nft-data/useUserCollectionListDab";
import { NftInfo } from "../../types/nft";
import { PostCreationForm } from "../Post/PostCreationForm";
import { NftCard } from "./NftCard";
import { NftImage } from "./NftImage";

interface CollectionListProps {
  userPid: string;
}

export const UserCollectionListDab = ({ userPid }: CollectionListProps) => {
  const userCollectionDabQuery = useUserCollectionListDab(userPid);

  const [isExpanded, setIsExpanded] = useState<boolean[]>([]);
  const [openForm, setOpenForm] = useState<boolean>(false);
  const [postFormNftInfo, setPostFormNftInfo] = useState<NftInfo>({
    canisterId: "",
    collectionName: "",
    tokenIndex: 0,
    tokenIdentifier: "",
    imageUrl: "",
    imageThumbnailUrl: "",
    clubId: "",
    imageType: "img",
    imageHeightWidthRatio: undefined,
  });

  const handleOpenForm = (
    collection: NFTCollection,
    token: NFTDetails<bigint | string>
  ) => {
    setOpenForm(true);
    setPostFormNftInfo({
      canisterId: collection.canisterId,
      collectionName: collection.name,
      tokenIndex: parseInt(token.index.toString()),
      tokenIdentifier: token.id ?? "",
      imageUrl: token.url,
      imageThumbnailUrl: token.url,
      clubId: "",
      imageType: "img",
      imageHeightWidthRatio: undefined,
    });
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  useEffect(() => {
    const collectionExpandedState: boolean[] = new Array(
      userCollectionDabQuery.data?.length
    ).fill(true);
    setIsExpanded(collectionExpandedState);
  }, [userCollectionDabQuery.data]);

  if (userCollectionDabQuery.isLoading) {
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
  } else if (userCollectionDabQuery.isError) {
    return (
      <div>
        {"Failed to fetch userCollectionList from dab api: " +
          userCollectionDabQuery.error.message}
      </div>
    );
  } else if (!userCollectionDabQuery.data) {
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
    console.dir(isExpanded);
  };

  if (userCollectionDabQuery.data.length == 0) {
    return <Box>You don't have any NFTs</Box>;
  }
  return (
    <Box>
      <Typography variant="h3">Other NFTs</Typography>
      <List>
        {userCollectionDabQuery.data.map((collection, index) => (
          <Box key={collection.canisterId}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="h5">
                {collection.name + ": " + collection.canisterId}
              </Typography>
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
                  <Box key={token.id}>
                    <NftCard
                      key={token.index.toString()}
                      index={token.index.toString()}
                    >
                      <NftImage
                        imageUrl={token.url}
                        width={500}
                        imageType="img"
                        imageHeightWidthRatio={undefined}
                      />{" "}
                    </NftCard>
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
          isPublicPost={true}
        />
      )}
    </Box>
  );
};
