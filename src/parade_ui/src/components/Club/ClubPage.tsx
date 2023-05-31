import { Box } from "@mui/material";
import { useParams } from "react-router-dom";
import { ClubFeed } from "./ClubFeed";
import { ClubTweet } from "./ClubTweet";

export const ClubPage = () => {
  const { clubId } = useParams();
  return (
    <Box
      display="flex"
      flexDirection="column"
      sx={{ marginLeft: "15%", marginTop: "5%", marginRight: "15%" }}
    >
      <ClubTweet clubId={clubId ?? ""} />
      <ClubFeed />
    </Box>
  );
};
