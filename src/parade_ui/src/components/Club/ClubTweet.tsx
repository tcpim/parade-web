import { Box, Button, CircularProgress, TextField } from "@mui/material";
import { useContext, useState } from "react";
import { AppContext } from "../../App";
import { useCreateClubPost } from "../../hooks/create-post/useCreateClubPost";

interface ClubTweetProps {
  clubId: string;
}
export const ClubTweet = ({ clubId }: ClubTweetProps) => {
  const appContext = useContext(AppContext);
  const [words, setWords] = useState("");

  const createPostMutation = useCreateClubPost({
    userPid: appContext.userLoginInfo.userPid,
    words,
    inPublic: false,
    clubId: clubId,
    onSuccessCallback: () => setWords(""),
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWords(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createPostMutation.mutate();
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <TextField
        multiline
        maxRows={5}
        fullWidth
        value={words}
        placeholder="What's on your mind about this club?"
        onChange={handleInputChange}
      />
      {createPostMutation.isLoading ? (
        <CircularProgress />
      ) : (
        <Button variant="contained" type="submit" disabled={words.length === 0}>
          Post
        </Button>
      )}
    </Box>
  );
};
