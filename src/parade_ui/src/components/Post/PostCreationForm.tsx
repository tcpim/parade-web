import React, { useState, useContext, useEffect } from "react";
import {
  Box,
  DialogContentText,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import Paper, { PaperProps } from "@mui/material/Paper";
import Draggable from "react-draggable";
import { useCreatePost } from "../../hooks/useCreatePost";
import { AppContext } from "../../App";
import { CreatePostRequest } from "../../../backend_declarations/main_server/main_server.did";

export interface PostCreationFormProps {
  open: boolean;
  nftCanisterId: string;
  nftCollectionName: string;
  nftTokenIndex: number;
  nftTokenIdentifier: string;
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
  nftCanisterId,
  nftCollectionName,
  nftTokenIndex,
  nftTokenIdentifier,
  handleCloseForm,
}: PostCreationFormProps) => {
  const [words, setWords] = useState("");
  const appContext = useContext(AppContext);

  const createPostMutation = useCreatePost({
    userPid: appContext.userLoginInfo.userPid,
    nftCanisterId,
    nftTokenIndex,
    nftTokenIdentifier,
    words: words,
    isPublicPost: true,
  });

  console.log(
    `isSuccess ${createPostMutation.isSuccess}, isLoading ${createPostMutation.isLoading}, isError ${createPostMutation.isError}}, tokenIndex ${nftTokenIndex}, tokenIdentifier ${nftTokenIdentifier}`
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWords(event.target.value);
  };

  const handleSubmit = () => {
    //console.log(`words ${words}, nftCanisterId ${nftCanisterId}, nftCollectionName ${nftCollectionName} nftTokenIndex ${nftTokenIndex}, nftTokenIdentifier ${nftTokenIdentifier}`)
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
      </DialogContent>
      <DialogActions>
        {!createPostMutation.isSuccess && (
          <Button onClick={handleCloseForm}>Cancel</Button>
        )}
        {!createPostMutation.isSuccess && (
          <Button
            type="submit"
            color="primary"
            onClick={handleSubmit}
            disabled={createPostMutation.isLoading}
          >
            Submit
          </Button>
        )}
        {createPostMutation.isSuccess && (
          <Button
            type="submit"
            color="primary"
            onClick={handleCloseFormResetMutation}
            disabled={createPostMutation.isLoading}
          >
            Done
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
