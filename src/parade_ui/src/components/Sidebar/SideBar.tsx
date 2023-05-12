import React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SignpostIcon from "@mui/icons-material/Signpost";
import YardIcon from "@mui/icons-material/Yard";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";

const SideBar = () => {
  return (
    <Box
      bgcolor="rgba(0, 128, 0, 0.2)"
      sx={{
        maxWidth: "10%",
        position: "fixed",
        borderRightColor: "red",
        borderRight: 1,
        height: "100vh",
      }}
    >
      <List sx={{ marginTop: "100px", overflow: "auto" }}>
        <ListItem divider>
          <ListItemButton>
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText primary="Create post" />
          </ListItemButton>
        </ListItem>
        <ListItem divider>
          <ListItemButton>
            <ListItemIcon>
              <SignpostIcon />
            </ListItemIcon>
            <ListItemText primary="Street" />
          </ListItemButton>
        </ListItem>
        <ListItem divider>
          <ListItemButton>
            <ListItemIcon>
              <YardIcon />
            </ListItemIcon>
            <ListItemText primary="Gardens" />
          </ListItemButton>
        </ListItem>
        <ListItem divider>
          <ListItemButton>
            <ListItemIcon>
              <MilitaryTechIcon />
            </ListItemIcon>
            <ListItemText primary="Rewards" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
};

export default SideBar;
