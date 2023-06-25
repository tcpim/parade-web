import { Box, Button, Divider } from "@mui/material";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ClubFeed } from "./ClubFeed";
import { ClubTweet } from "./ClubTweet";

export const ClubPage = () => {
  const { clubId } = useParams();
  const [subPage, setSubPage] = useState("feed");
  const navigate = useNavigate();

  return (
    <Box
      display="flex"
      flexDirection="column"
      sx={{ marginLeft: "15%", marginTop: "5%", marginRight: "15%" }}
    >
      <Box display="flex" justifyContent="space-evenly">
        <Button
          disabled={subPage === "feed"}
          onClick={() => navigate("/clubs/" + clubId)}
        >
          Feed
        </Button>
        <Divider orientation="vertical" flexItem />
        <Button
          disabled={subPage === "chat"}
          onClick={() => navigate("/clubs/" + clubId + "/chat")}
        >
          Chat
        </Button>
      </Box>
      <ClubTweet clubId={clubId ?? ""} />
      <ClubFeed />
    </Box>
  );
};
