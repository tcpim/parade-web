import {
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../App";
import { useCreatePost } from "../../hooks/create-post/useCreatePost";
import { NftImage } from "../Nft/NftImage";
import { NftSelector } from "../Nft/NftSelector";
import { NftInfo } from "../Nft/nft";

export const PostCreationPage = () => {
  const navigate = useNavigate();
  const appContext = useContext(AppContext);
  const [selectedNft, setSelectedNft] = useState<NftInfo>();
  const [postToStreetChecked, setPostToStreetChecked] = useState(false);
  const [words, setWords] = useState("");
  const [createPostFinished, setCreatePostFinished] = useState(false);

  const createPostMutation = useCreatePost({
    userPid: appContext.userLoginInfo.userPid,
    nftInfo: selectedNft,
    words: words,
    isPublicPost: postToStreetChecked || selectedNft?.clubId === "",
    clubIds: selectedNft ? [selectedNft.clubId] : [],
    onSuccessCallback: () => handlePostCreationFinished(),
  });

  const handlePostSubmit = () => {
    createPostMutation.mutate();
  };

  const handlePostCreationFinished = () => {
    setCreatePostFinished(true);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      sx={{ marginLeft: "15%", marginTop: "5%", marginRight: "15%" }}
    >
      <Box
        border={1}
        borderColor="primary.grey"
        boxShadow={3}
        height="500px"
        display="flex"
        justifyContent="space-around"
      >
        <Paper
          sx={{
            width: "30%",
            height: "80%",
            marginLeft: 10,
            marginTop: 5,
            marginBottom: 5,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {selectedNft ? (
            <NftImage
              imageUrl={selectedNft.nftOriginalThumbnailUrl}
              canisterId={selectedNft.nftCanisterId}
            />
          ) : (
            <Typography variant="h5">Select your NFT</Typography>
          )}
        </Paper>
        <Box flexBasis="40%" marginTop={5}>
          <TextField
            fullWidth
            multiline
            value={words}
            placeholder="Tell your thoughts"
            onChange={(e) => setWords(e.target.value)}
          ></TextField>
          {selectedNft !== undefined && selectedNft?.clubId !== "" && (
            <Box display="flex" alignItems="center">
              <Typography>Also post to street</Typography>
              <Checkbox
                checked={postToStreetChecked}
                onChange={(e) => setPostToStreetChecked(e.target.checked)}
              />
            </Box>
          )}
          {createPostMutation.isLoading ? (
            <CircularProgress />
          ) : createPostFinished ? (
            <Button
              sx={{ marginTop: 1 }}
              variant="contained"
              onClick={() =>
                navigate("/post/" + createPostMutation.data?.post.id)
              }
            >
              Check your post
            </Button>
          ) : (
            <Button
              sx={{ marginTop: 1 }}
              variant="contained"
              onClick={handlePostSubmit}
              disabled={selectedNft === undefined}
            >
              Post
            </Button>
          )}
        </Box>
      </Box>
      <NftSelector onNftSelected={setSelectedNft} />
    </Box>
  );
};
