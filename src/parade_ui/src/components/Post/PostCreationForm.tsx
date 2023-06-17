import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import Paper, { PaperProps } from "@mui/material/Paper";
import React, { Fragment, useContext, useState } from "react";
import Draggable from "react-draggable";
import { AppContext } from "../../App";
import { useCreatePost } from "../../hooks/create-post/useCreateStreetPost";
import { NftInfo } from "../Nft/nft";

export interface PostCreationFormProps {
  open: boolean;
  nftInfo: NftInfo;
  isPublicPost?: boolean;
  handleCloseForm: () => void;
}

function PaperComponent(props: PaperProps) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

export const PostCreationForm = ({
  open,
  nftInfo,
  handleCloseForm,
}: PostCreationFormProps) => {
  const [words, setWords] = useState("");
  const isClubNft = !!nftInfo.clubId;
  const [isPublicPost, setIsPublicPost] = useState(!isClubNft);
  const [mutationFinished, setMutationFinished] = useState(false);

  const appContext = useContext(AppContext);

  const createPostMutation = useCreatePost({
    userPid: appContext.userLoginInfo.userPid,
    nftInfo,
    words,
    isPublicPost,
    clubIds: isClubNft ? [nftInfo.clubId] : [],
    onSuccessCallback: () => setMutationFinished(true),
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWords(event.target.value);
  };

  const handleSubmit = () => {
    createPostMutation.mutate();
  };

  const handleCloseFormResetMutation = () => {
    handleCloseForm();
    createPostMutation.reset();
  };

  return (
    <Dialog
      open={open}
      onClose={handleCloseForm}
      PaperComponent={PaperComponent}
      maxWidth="md"
      fullWidth={true}
    >
      <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
        Post NFT
      </DialogTitle>
      <DialogContent>
        <DialogContentText>Show off your NFTs!</DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          type="text"
          name="name"
          placeholder="Say something..."
          fullWidth
          onChange={handleInputChange}
        />
        {isClubNft && (
          <Box display="flex">
            <Typography>Post to public street?</Typography>
            <Checkbox
              checked={isPublicPost}
              onChange={() => setIsPublicPost(true)}
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        {createPostMutation.isLoading ? (
          <CircularProgress />
        ) : mutationFinished ? (
          <Button onClick={handleCloseFormResetMutation}>Done</Button>
        ) : (
          <Fragment>
            <Button onClick={handleCloseForm}>Cancel</Button>
            <Button onClick={handleSubmit}>Submit</Button>
          </Fragment>
        )}
      </DialogActions>
    </Dialog>
  );
};
