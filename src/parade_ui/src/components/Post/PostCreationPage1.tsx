import { Box, Button, CircularProgress, Typography } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import { AppContext } from "../../App";
import { useCreateClubPost } from "../../hooks/create-post/useCreateClubPost";
import { useCreateStreetPost } from "../../hooks/create-post/useCreateStreetPost";
import { NftInfo } from "../../types/nft";
import { Post } from "../../types/post";
import { NftImage } from "../Nft/NftImage";
import { UserPortfolioMemo } from "../Nft/UserPortfolio";

type SubPage = "club-nfts" | "other-nfts";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  margin: 2rem 5rem;
`;

const StyledForm = styled.div`
  display: flex;
  justify-content: "space-around";
  border: 1px solid black;
  padding: 2rem;
  gap: 2rem;
`;

const ImageWindow = styled.div`
  border: 1px solid gray;
  width: 400px;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TextWidow = styled.div`
  display: flex;
  flex-direction: column;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const SubTabDiv = styled.div`
  display: flex;
  justify-content: space-around;
  margin: 2rem 5rem;
`;

interface SubTabButtonProps {
  selected: boolean;
}
const SubTabButton = styled.button<SubTabButtonProps>`
  border: none;
  width: 10rem;
  height: 3rem;
  font-size: large;
  background-color: transparent;
  border-bottom: 2px solid
    ${(props) => (props.selected ? "rgba(255, 56, 92, 1)" : "none")};
  &:hover {
    background-color: #c4c2c2;
  }
`;

export const PostCreationPage1 = () => {
  const navigate = useNavigate();
  const appContext = useContext(AppContext);
  const [selectedNft, setSelectedNft] = useState<NftInfo>();
  const [postToStreetChecked, setPostToStreetChecked] = useState(false);
  const [words, setWords] = useState("");
  const [createPostFinished, setCreatePostFinished] = useState(false);
  const [subPage, setSubPage] = useState<SubPage>("club-nfts");

  const subTabs = () => {
    return (
      <SubTabDiv>
        <SubTabButton
          disabled={subPage === "club-nfts"}
          selected={subPage === "club-nfts"}
          onClick={() => setSubPage("club-nfts")}
        >
          Club NFTs
        </SubTabButton>

        <SubTabButton
          disabled={subPage === "other-nfts"}
          selected={subPage === "other-nfts"}
          onClick={() => setSubPage("other-nfts")}
        >
          Other NFTs
        </SubTabButton>
      </SubTabDiv>
    );
  };
  const clubId = selectedNft?.clubId ?? "";

  const createStreetPostMutation = useCreateStreetPost({
    userPid: appContext.userLoginInfo.userPid,
    nftInfo: selectedNft,
    words: words,
    onSuccessCallback: () => handlePostCreationFinished(),
  });

  const createClubPostMutation = useCreateClubPost({
    userPid: appContext.userLoginInfo.userPid,
    nftInfo: selectedNft,
    words: words,
    clubId: clubId,
    inPublic: postToStreetChecked,
    onSuccessCallback: () => handlePostCreationFinished(),
  });

  const normalizedMutation =
    clubId === "" ? createStreetPostMutation : createClubPostMutation;

  const handlePostSubmit = () => {
    normalizedMutation.mutate();
  };

  const handlePostCreationFinished = () => {
    setCreatePostFinished(true);
  };

  const handleCheckPostClicked = (post?: Post) => {
    if (post) {
      if (post.clubId) {
        navigate(`/club/${post.clubId}/post/${post.postId}`);
      } else {
        navigate(`/post/${post.postId}`);
      }
    }
  };

  const handleOnNftSelected = (nftInfo: NftInfo) => {
    setSelectedNft(nftInfo);
    setPostToStreetChecked(false);
    setCreatePostFinished(false);
    setWords("");
    window.alert("NFT selected");
  };

  return (
    <Wrapper>
      <StyledForm>
        <ImageWindow>
          {selectedNft ? (
            <NftImage
              imageUrl={selectedNft.imageUrl}
              width={500}
              imageType={selectedNft.imageType}
              imageHeightWidthRatio={selectedNft.imageHeightWidthRatio}
            />
          ) : (
            <h4>Select your NFT</h4>
          )}
        </ImageWindow>
        <TextWidow>
          <textarea
            placeholder="What's on your mind?"
            value={words}
            onChange={(e: any) => setWords(e.target.value)}
            rows={10}
            cols={40}
            maxLength={500}
          />
          {selectedNft !== undefined && selectedNft?.clubId !== "" && (
            <Box display="flex" alignItems="center">
              <Typography>Also post to street</Typography>
              <Checkbox
                checked={postToStreetChecked}
                onChange={(e) => setPostToStreetChecked(e.target.checked)}
              />
            </Box>
          )}
          <ButtonWrapper>
            {normalizedMutation.isLoading ? (
              <CircularProgress />
            ) : createPostFinished ? (
              <Button
                sx={{ marginTop: 1 }}
                variant="contained"
                onClick={() => handleCheckPostClicked(normalizedMutation.data)}
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
          </ButtonWrapper>
        </TextWidow>
      </StyledForm>
      {subTabs()}
      {subPage === "club-nfts" && (
        <UserPortfolioMemo
          nftType="club"
          withImageOverlay={true}
          handleImageOverlayClick={handleOnNftSelected}
        />
      )}
      {subPage === "other-nfts" && (
        <UserPortfolioMemo
          nftType="other"
          withImageOverlay={true}
          handleImageOverlayClick={handleOnNftSelected}
        />
      )}
    </Wrapper>
  );
};
