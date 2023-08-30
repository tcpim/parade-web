import * as amplitude from "@amplitude/analytics-browser";
import { CircularProgress } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import * as Dialog from "@radix-ui/react-dialog";
import * as Popover from "@radix-ui/react-popover";
import { Fragment, memo, useContext, useState } from "react";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { styled } from "styled-components";
import { AppContext } from "../../App";
import { useCreateClubPost } from "../../hooks/create-post/useCreateClubPost";
import { useCreateStreetPost } from "../../hooks/create-post/useCreateStreetPost";
import { NftInfo } from "../../types/nft";

const DialogOverlay = styled(Dialog.Overlay)`
  background-color: rgba(184, 183, 183, 0.694);
  position: fixed;
  inset: 0;
  pointer-events: none;
`;

const DialogContent = styled(Dialog.Content)`
  background-color: white;
  border-radius: 1rem;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50vw;
  max-width: 80vw;
  max-height: 80vh;
  padding: 2rem;
`;

const DialogTextarea = styled.textarea`
  width: 100%;
  margin: 1rem 0;
  resize: none;
`;

const DialogCheckboxRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const DialogButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const StyledButton = styled.button`
  cursor: pointer;
  border-radius: 0.5rem;
  background-color: white;
  &:hover {
    color: gray;
  }
`;

interface TooltipWrapperProps {
  children: React.ReactNode;
  className?: string;
  tooltipText: string;
}

const TooltipWrapper = ({ children, tooltipText }: TooltipWrapperProps) => {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          style={{
            display: "flex",
            border: "none",
            background: "none",
          }}
        >
          {children}
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content side="bottom" sideOffset={5} align="start">
          <div
            style={{
              backgroundColor: "#ecebeb",
              padding: "1rem",
              borderRadius: "1rem",
            }}
          >
            {tooltipText}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

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

  const handleCreateButtonClicked = () => {
    normalizedMutation.mutate();
    const eventProp = {
      clubId: nftInfo.clubId,
      collection: nftInfo.canisterId,
      userId: appContext.userLoginInfo.userPid,
      page: "portfolio_page",
    };
    if (isClubNft) {
      amplitude.track("create_club_post", eventProp);
    } else {
      amplitude.track("create_street_post", eventProp);
    }
  };

  const postButton = () => {
    if (normalizedMutation.isLoading) {
      return <CircularProgress />;
    } else if (normalizedMutation.isError) {
      return (
        <div style={{ display: "flex", alignItems: "center" }}>
          <p>Something went wrong</p>
          <Dialog.Close asChild>
            <StyledButton onClick={handleCloseForm}>Cancel</StyledButton>
          </Dialog.Close>
        </div>
      );
    } else if (mutationFinished) {
      return (
        <Dialog.Close asChild>
          <StyledButton onClick={handleCloseForm}>Done</StyledButton>
        </Dialog.Close>
      );
    } else {
      return (
        <Fragment>
          <Dialog.Close asChild>
            <StyledButton onClick={handleCloseForm}>Cancel</StyledButton>
          </Dialog.Close>
          <Dialog.Close asChild>
            <StyledButton onClick={handleCreateButtonClicked} disabled={!words}>
              Submit
            </StyledButton>
          </Dialog.Close>
        </Fragment>
      );
    }
  };

  return (
    <Dialog.Root open={open} modal={true}>
      <Dialog.Portal>
        <DialogOverlay />
        <DialogContent>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <h3>Flex your NFT</h3>
            <TooltipWrapper tooltipText="This won't touch (list or transfer) your nft. Only the image is attached">
              <AiOutlineQuestionCircle size="1rem" />
            </TooltipWrapper>
          </div>
          <DialogTextarea
            placeholder="What's on your mind?"
            value={words}
            onChange={(e: any) => setWords(e.target.value)}
            rows={10}
            cols={40}
            maxLength={500}
          />
          {isClubNft && (
            <DialogCheckboxRow>
              <Checkbox
                checked={isPublicPost}
                onChange={(e) => setIsPublicPost(e.target.checked)}
              />
              <label htmlFor="c1">Also post to public street</label>
              <TooltipWrapper tooltipText="Club NFT will be posted to its club by default. Check this to also post to street">
                <AiOutlineQuestionCircle size="1rem" />
              </TooltipWrapper>
            </DialogCheckboxRow>
          )}
          <DialogButtons> {postButton()}</DialogButtons>
        </DialogContent>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export const PostCreationFormMemo = memo(PostCreationForm);
