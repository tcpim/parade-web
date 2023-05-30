import AddIcon from "@mui/icons-material/Add";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { NFTCollection, NFTDetails } from "@psychedelic/dab-js";
import { useEffect, useState } from "react";
import { useUserCollectionListDab } from "../../hooks/fetch-nft-data/useUserCollectionListDab";
import { PostCreationForm } from "../Post/PostCreationForm";
import { NftImage } from "./NftImage";
import { NftInfo } from "./nft";

export interface NftImageProps {
  index: string;
  name?: string;
  imageUrl: string;
  standard?: string;
  canisterId: string;
}

export const NftCard = ({
  index,
  name,
  imageUrl,
  standard,
  canisterId,
}: NftImageProps) => {
  const CardContentNoPadding = styled(CardContent)(`
          padding: 0;
          &:last-child {
              padding-bottom: 0px;
          };
          display: flex;
          justify-content: space-between;
          button {
              justify-content: center;
              min-width: 25%;
          }
          & .MuiTypography-root {
              display:flex;
              flex-direction: column;
              justify-content: center;
          }
      `);

  return (
    <Card sx={{ maxWidth: 350, mr: 1, mt: 1 }}>
      <NftImage imageUrl={imageUrl} canisterId={canisterId} />
      <CardContentNoPadding>
        <Typography variant="subtitle2" component="div">
          {name ? name : "#".concat(index)}
        </Typography>
      </CardContentNoPadding>
    </Card>
  );
};

interface CollectionListProps {
  userPid: string;
}

export const UserCollectionListDab = ({ userPid }: CollectionListProps) => {
  const userCollectionDabQuery = useUserCollectionListDab(userPid);

  const [isExpanded, setIsExpanded] = useState<boolean[]>([]);
  const [openForm, setOpenForm] = useState<boolean>(false);
  const [postFormNftInfo, setPostFormNftInfo] = useState<NftInfo>({
    nftCanisterId: "",
    nftCollectionName: "",
    nftTokenIndex: 0,
    nftTokenIdentifier: "",
    nftOriginalImageUrl: "",
    nftOriginalThumbnailUrl: "",
    clubId: "",
  });

  const handleOpenForm = (
    collection: NFTCollection,
    token: NFTDetails<bigint | string>
  ) => {
    setOpenForm(true);
    setPostFormNftInfo({
      nftCanisterId: collection.canisterId,
      nftCollectionName: collection.name,
      nftTokenIndex: parseInt(token.index.toString()),
      nftTokenIdentifier: token.id ?? "",
      nftOriginalImageUrl: token.url,
      nftOriginalThumbnailUrl: token.url,
      clubId: "",
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
    throw new Error(
      "Failed to fetch userCollectionList from api: " +
        userCollectionDabQuery.error.message
    );
  } else if (!userCollectionDabQuery.data) {
    return <div>No data is available</div>;
  } else {
    console.log(userCollectionDabQuery.data);
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
                      imageUrl={token.url.replace("type=thumbnail&", "")}
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
          isPublicPost={true}
        />
      )}
    </Box>
  );
};
