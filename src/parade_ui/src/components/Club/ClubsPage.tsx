import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import TopBar from "../Topbar/TopBar";
import SideBar from "../Sidebar/SideBar";
import { Feed } from "@mui/icons-material";
import { LeaderBoard } from "../Homepage/LeaderBoard";

const ClubList = () => {
  const navigate = useNavigate();

  return (
    <List>
      <ListItem>
        <ListItemButton
          onClick={() => {
            navigate("/clubs/ludo-arts");
          }}
        >
          <ListItemText primary="Ludo Flowers" />
        </ListItemButton>
      </ListItem>
      <ListItem>
        <ListItemButton
          onClick={() => {
            navigate("/clubs/poked-bots");
          }}
        >
          <ListItemText primary="Poked Bots" />
        </ListItemButton>
      </ListItem>
      <ListItem>
        <ListItemButton
          onClick={() => {
            navigate("/clubs/motoko-ghost");
          }}
        >
          <ListItemText primary="Motoko Ghosts" />
        </ListItemButton>
      </ListItem>
    </List>
  );
};

export const ClubsPage = () => {
  return (
    <Box>
      <TopBar />
      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem />}
        justifyContent="space-between"
        height="100vh"
        sx={{ marginTop: "5%" }}
      >
        <SideBar />
        <ClubList />
        <LeaderBoard />
      </Stack>
    </Box>
  );
};
