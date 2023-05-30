import { Box } from "@mui/material";
import { ClubFeed } from "./ClubFeed";
import { ClubTweet } from "./ClubTweet";

export const ClubPage = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      sx={{ marginLeft: "15%", marginTop: "5%", marginRight: "15%" }}
    >
      <ClubTweet />
      <ClubFeed />
    </Box>
  );
};
