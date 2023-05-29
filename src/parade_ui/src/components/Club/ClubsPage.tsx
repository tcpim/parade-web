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
      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem />}
        justifyContent="space-between"
        height="100vh"
        sx={{ marginTop: "5%" }}
      >
        <ClubList />
      </Stack>
    </Box>
  );
};
