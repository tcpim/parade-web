import { Box, Stack } from "@mui/material";
import TopBar from "../Topbar/TopBar";
import { Feed } from "./Feed";
import Divider from "@mui/material/Divider";
import { useState } from "react";

export const Homepage = () => {
  const [selectedCollection, setSelectedCollection] = useState("");

  return (
    <Box>
      {/* <TopBar searchCollection={setSelectedCollection} /> */}
      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem />}
        justifyContent="space-between"
        height="100vh"
        sx={{ marginTop: "5%" }}
      >
        <Feed canisterId={selectedCollection} />
      </Stack>
    </Box>
  );
};
