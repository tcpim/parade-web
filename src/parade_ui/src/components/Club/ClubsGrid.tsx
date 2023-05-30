import { Box, Divider, ImageList, ImageListItem, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import btcflower from "../../../assets/btc-flower-club.png";
import motoko from "../../../assets/motoko-club.png";
import pokedbot from "../../../assets/poked-bot-club.png";
const ClubList = () => {
  const navigate = useNavigate();

  return (
    <ImageList sx={{ width: "100%", height: "100%" }} cols={3} rowHeight={30}>
      <Box onClick={() => navigate("/clubs/ludo-arts")}>
        <ImageListItem>
          <img src={btcflower} loading="lazy" />
        </ImageListItem>
      </Box>
      <Box onClick={() => navigate("/clubs/poked-bots")}>
        <ImageListItem>
          <img src={pokedbot} loading="lazy" />
        </ImageListItem>
      </Box>
      <Box onClick={() => navigate("/clubs/motoko-ghost")}>
        <ImageListItem>
          <img src={motoko} loading="lazy" />
        </ImageListItem>
      </Box>
    </ImageList>
  );
};

export const ClubsGrid = () => {
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
