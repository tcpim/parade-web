import { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { server_backend } from '../../declarations/server_backend';
import { CreatePostRequest, NftToken, NftTokenStandard, Post } from '../../declarations/server_backend/server_backend.did';
import { Principal } from '@dfinity/principal';

export default function PostNftForm(props: any) {
  const [open, setOpen] = useState(false);
  const { collection, token } = props;
  const [textValue, setTextValue] = useState("");
  const user = window.ic.plug.principalId;

  const handleTextChange = (event: any) => {
    setTextValue(event.target.value);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlePostSubmit = () => {
    console.log("user: " + user);
    console.log("url:" + token.url);
    //const newPost: Post = {user: user, url: token.url, words: textValue};

    const nftRequest: NftToken = {
      listing: [],
      token_id: token.index.toString(),
      canister_id: collection.canisterId,
      token_standard: { 'EXT': null },
    }
    const newPostRequest: CreatePostRequest = {
      nfts: [nftRequest],
      user: Principal.fromText(user),
      words: textValue,
    }
    const postData = async () => {
      //await hello_backend.post(user, token.url, textValue);
      //await rust_hello_backend.add_post(newPost);
      await server_backend.create_post(newPostRequest);
    };

    postData().catch(console.error);
    handleClose();
    window.alert("Post uploaded");
  };


  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Post this NFT
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Post this NFT here!</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You want to post this NFT collection: {collection.canisterId} and tokenId: {token.id}?
            <br /><br />
            See token on IC {token.url}
          </DialogContentText>
          <br /><br />
          <TextField
            id="outlined-textarea"
            label="Post with words"
            placeholder="what you wanna say?"
            multiline
            value={textValue}
            onChange={handleTextChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handlePostSubmit}>Post to streets</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
