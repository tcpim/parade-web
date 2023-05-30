import { Box, Button, TextField } from "@mui/material";

export const ClubTweet = () => {
  return (
    <Box component="form">
      <TextField
        multiline
        maxRows={5}
        fullWidth
        defaultValue="What's on your mind"
      />
      <Button variant="contained">Post</Button>
    </Box>
  );
};
