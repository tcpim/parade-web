import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AddIcon from "@mui/icons-material/Add";
import SignpostIcon from "@mui/icons-material/Signpost";
import YardIcon from "@mui/icons-material/Yard";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../../App";
import { RightSideBar } from "./RightSideBar";

interface LayoutWithSideBarProps {
  children: React.ReactNode;
}
export const LayoutWithSideBar = ({ children }: LayoutWithSideBarProps) => {
  const appContext = useContext(AppContext);
  const navigate = useNavigate();
  const leftSidebarWidth = 200;
  const rightSideBarWidth = 200;

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer variant="permanent" sx={{ width: leftSidebarWidth }}>
        <Box sx={{ marginLeft: 5, marginTop: 3, marginBottom: 3 }}>
          <Typography
            variant="h6"
            sx={{ color: "blue" }}
            component={Link}
            to="/"
          >
            Parade
          </Typography>
        </Box>
        <Box sx={{ marginTop: "100px" }}>
          <List>
            <ListItem>
              <ListItemButton onClick={() => navigate("/")}>
                <ListItemIcon>
                  <SignpostIcon />
                </ListItemIcon>
                <ListItemText primary="Street" />
              </ListItemButton>
            </ListItem>
            <ListItem>
              <ListItemButton onClick={() => navigate("/clubs")}>
                <ListItemIcon>
                  <YardIcon />
                </ListItemIcon>
                <ListItemText primary="Clubs" />
              </ListItemButton>
            </ListItem>
            <ListItem>
              <ListItemButton onClick={() => navigate("/post-creator")}>
                <ListItemIcon>
                  <AddIcon />
                </ListItemIcon>
                <ListItemText primary="Create" />
              </ListItemButton>
            </ListItem>
            {appContext.userLoginInfo.walletConnected && (
              <ListItem>
                <ListItemButton onClick={() => navigate("/profile")}>
                  <ListItemIcon>
                    <AccountCircleIcon />
                  </ListItemIcon>
                  <ListItemText primary="Profile" />
                </ListItemButton>
              </ListItem>
            )}
          </List>
        </Box>
      </Drawer>
      <Box
        component="main"
        sx={{ width: `calc(100% - ${leftSidebarWidth + rightSideBarWidth}px)` }}
      >
        {children}
      </Box>
      <RightSideBar width={rightSideBarWidth} />
    </Box>
  );
};
