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
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import { styled } from "@mui/material/styles";
import { NftImage } from "./NftImage";

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
