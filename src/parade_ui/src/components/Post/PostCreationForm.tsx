import React, { useState, useContext, useEffect, Fragment } from "react";
import {
  Box,
  DialogContentText,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Checkbox,
  Typography,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import Paper, { PaperProps } from "@mui/material/Paper";
import Draggable from "react-draggable";
import { useCreatePost } from "../../hooks/useCreatePost";
import { AppContext } from "../../App";
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
  const [isPublicPost, setIsPublicPost] = useState(true);
  const appContext = useContext(AppContext);

  const isClubNft = nftInfo.clubId !== undefined;

  const createPostMutation = useCreatePost({
    userPid: appContext.userLoginInfo.userPid,
    nftInfo,
    words,
    isPublicPost,
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
        <Box>
          <Typography>Post to public street?</Typography>
          <Checkbox />
        </Box>
      </DialogContent>
      <DialogActions>
        {createPostMutation.isLoading ? (
          <CircularProgress />
        ) : createPostMutation.isSuccess ? (
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
