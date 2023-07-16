import { CircularProgress } from "@mui/material";
import * as Checkbox from "@radix-ui/react-checkbox";
import * as Dialog from "@radix-ui/react-dialog";
import React, { Fragment, memo, useContext, useState } from "react";
import { AiOutlineCheck } from "react-icons/ai";
import { styled } from "styled-components";
import { AppContext } from "../../App";
import { useCreateClubPost } from "../../hooks/create-post/useCreateClubPost";
import { useCreateStreetPost } from "../../hooks/create-post/useCreateStreetPost";
import { NftInfo } from "../../types/nft";

const DialogOverlay = styled(Dialog.Overlay)`
  background-color: rgba(184, 183, 183, 0.694);
  position: fixed;
  inset: 0;
`;

const DialogContent = styled(Dialog.Content)`
  background-color: white;
  border-radius: 6px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90vw;
  max-width: 450px;
  max-height: 85vh;
  min-height: 500px;
  padding: 25px;
`;

export interface PostCreationFormProps {
  open: boolean;
  nftInfo: NftInfo;
  handleCloseForm: () => void;
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

  const createStreetPostMutation = useCreateStreetPost({
    userPid: appContext.userLoginInfo.userPid,
    nftInfo: nftInfo,
    words: words,
    onSuccessCallback: () => setMutationFinished(true),
  });
  const createClubPostMutation = useCreateClubPost({
    userPid: appContext.userLoginInfo.userPid,
    nftInfo: nftInfo,
    words: words,
    clubId: nftInfo.clubId ?? "",
    inPublic: isPublicPost,
    onSuccessCallback: () => setMutationFinished(true),
  });
  const normalizedMutation = isClubNft
    ? createClubPostMutation
    : createStreetPostMutation;

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWords(event.target.value);
  };

  const handleSubmit = () => {
    normalizedMutation.mutate();
  };

  const handleCloseFormResetMutation = () => {
    handleCloseForm();
    normalizedMutation.reset();
  };

  return (
    <Dialog.Root open={open} modal={true}>
      <Dialog.Portal>
        <DialogOverlay />
        <DialogContent onPointerDownOutside={handleCloseForm}>
          <Dialog.Title>Flex your NFT</Dialog.Title>
          <Dialog.Description>
            Post your NFT with a message to the world!
          </Dialog.Description>
          <textarea
            placeholder="Tell about yourself"
            value={words}
            onChange={(e: any) => setWords(e.target.value)}
            rows={5}
            cols={40}
            maxLength={200}
          />
          {isClubNft && (
            <div style={{ display: "flex", alignItems: "center" }}>
              <Checkbox.Root
                onCheckedChange={() => setIsPublicPost(true)}
                id="c1"
                style={{ width: "25px", height: "25px" }}
              >
                <Checkbox.Indicator>
                  <AiOutlineCheck />
                </Checkbox.Indicator>
              </Checkbox.Root>
              <label htmlFor="c1">Also post to public street</label>
            </div>
          )}
          <div>
            {normalizedMutation.isLoading ? (
              <CircularProgress />
            ) : mutationFinished ? (
              <Dialog.Close asChild>
                <button onClick={handleCloseFormResetMutation}>Done</button>
              </Dialog.Close>
            ) : (
              <Fragment>
                <Dialog.Close asChild>
                  <button onClick={handleCloseForm}>Cancel</button>
                </Dialog.Close>
                <Dialog.Close asChild>
                  <button onClick={handleSubmit}>Submit</button>
                </Dialog.Close>
              </Fragment>
            )}
          </div>
        </DialogContent>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export const PostCreationFormMemo = memo(PostCreationForm);
