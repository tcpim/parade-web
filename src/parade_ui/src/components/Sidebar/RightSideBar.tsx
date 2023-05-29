import React, { useContext } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Drawer,
  Typography,
  Toolbar,
  Divider,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SignpostIcon from "@mui/icons-material/Signpost";
import YardIcon from "@mui/icons-material/Yard";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { AppContext } from "../../App";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import WalletConnection from "../Topbar/WalletConnection";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { Wallet } from "@mui/icons-material";

interface RightSideBarProps {
  width: number;
}
export const RightSideBar = ({ width }: RightSideBarProps) => {
  const appContext = useContext(AppContext);
  const navigate = useNavigate();

  return (
    <Box
      sx={{ display: "flex", justifyContent: "center", width: `${width}px` }}
    >
      <Drawer variant="permanent" anchor="right">
        <Box sx={{ margin: 3 }}>
          <WalletConnection />
        </Box>
      </Drawer>
    </Box>
  );
};
