import { useContext, useEffect, useState } from "react";
import { Box } from "@mui/material";
import { AppContext } from "../../App";
import Typography from "@mui/material/Typography";
import {
  getAllUserNFTs,
  getNFTInfo,
  getNFTActor,
  NFTCollection,
  getCachedUserNFTs,
} from "@psychedelic/dab-js";
import List from "@mui/material/List";
import Stack from "@mui/material/Stack";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import CardContent from "@mui/material/CardContent";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import CircularProgress from "@mui/material/CircularProgress";
import { UserCollectionList } from "./UserCollectionList";

const UserPortfolio = () => {
  const appContext = useContext(AppContext);

  if (!appContext.userLoginInfo.walletConnected) {
    return (
      <Box
        bgcolor="rgba(251, 18, 18, 0.2)"
        sx={{
          flexBasis: "85%",
          marginLeft: "15%",
          marginTop: "5%",
          overflow: "auto",
        }}
      >
        Please connect to wallet to see your portfolio
      </Box>
    );
  }

  return (
    <Box
      bgcolor="rgba(251, 18, 18, 0.2)"
      sx={{
        flexBasis: "85%",
        marginLeft: "15%",
        marginTop: "5%",
        overflow: "auto",
      }}
    >
      <UserCollectionList userAccount={appContext.userLoginInfo.userAccount} />
    </Box>
  );
};

export default UserPortfolio;
