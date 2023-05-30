import { Box, Stack } from "@mui/material";
import Divider from "@mui/material/Divider";
import { useState } from "react";
import { Feed } from "./Feed";

export const Homepage = () => {
  const [selectedCollection, setSelectedCollection] = useState("");

  return (
    <Box>
      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem />}
        justifyContent="space-between"
        height="100vh"
        sx={{ marginTop: "5%" }}
      >
        <Feed />
      </Stack>
    </Box>
  );
};
