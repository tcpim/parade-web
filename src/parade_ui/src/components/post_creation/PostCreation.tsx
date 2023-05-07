import React, { useState, useContext } from "react";
import { Box, DialogContentText, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import { useMutation } from "react-query";
import Paper, { PaperProps } from '@mui/material/Paper';
import Draggable from 'react-draggable';
import { useCreatePost } from "../../hooks/useCreatePost";
import { AppContext } from '../../App';
import { CreatePostRequest } from "../../../backend_declarations/main_server/main_server.did";

export interface PostCreationFormProps {
    open: boolean;
    nftCanisterId: string;
    nftCollectionName: string;
    nftTokenIndex: number;
    nftTokenIdentifier: string;
    handleClose: () => void;
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
    handleClose,
}: PostCreationFormProps) => {
    const [words, setWords] = useState("");
    const appContext = useContext(AppContext)

    const {createPostAction, isLoading, isError, error, isSuccess, data} = useCreatePost({
        userPid: appContext.userLoginInfo.userPid,
        nftCanisterId,
        nftTokenIndex,
        nftTokenIdentifier,
        words: words,
        isPublicPost: true,
    });

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setWords(event.target.value);
    }

    const handleSubmit = () => {
        console.log(`words ${words}, nftCanisterId ${nftCanisterId}, nftCollectionName ${nftCollectionName} nftTokenIndex ${nftTokenIndex}, nftTokenIdentifier ${nftTokenIdentifier}`)
        createPostAction();
    }

    if (isSuccess) {
        console.log(`hi!!! ${data?.post.id}`);
    }

    return (
        <Dialog open={open} onClose={handleClose} PaperComponent={PaperComponent}>
            <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">Post NFT</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Show off your NFTs!
                </DialogContentText>
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
                <Button onClick={handleClose}>Cancel</Button>
                <Button type="submit" color="primary" onClick={handleSubmit} disabled={isLoading}>Submit</Button>
            </DialogActions>
        </Dialog>
    )
}