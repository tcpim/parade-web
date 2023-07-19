import { CircularProgress } from "@mui/material";
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
  gap: 2rem;
  padding: 2rem 5rem;
  background-color: #e9e9e9;
`;

const StyledForm = styled.div`
  display: flex;
  border: 1px solid black;
  padding: 2rem;
  gap: 2rem;
  width: 80%;
  align-self: center;
  background-color: white;
  border-radius: 1rem;
`;

interface ImageWindowProps {
  imgHeight: number;
}
const ImageWindow = styled.div<ImageWindowProps>`
  border: 1px solid gray;
  width: 400px;
  height: ${(props) => props.imgHeight}px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TextWidow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 50%;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const SubTabDiv = styled.div`
  display: flex;
  justify-content: space-around;
  margin: 2rem 5rem;
  gap: 2rem;
  align-self: center;
`;

const StyledTextarea = styled.textarea`
  resize: none;
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
    cursor: pointer;
  }
`;

const StyledButton = styled.button`
  width: min-content;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  height: 2rem;
  border-radius: 0.5rem;
  background-color: white;

  &:hover {
    background-color: #b8b8b8;
    cursor: pointer;
  }
`;

export const PostCreationPage = () => {
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
  };

  return (
    <Wrapper>
      <StyledForm>
        <ImageWindow
          imgHeight={
            selectedNft?.imageHeightWidthRatio
              ? 400 * selectedNft.imageHeightWidthRatio
              : 400
          }
        >
          {selectedNft ? (
            <NftImage
              imageUrl={selectedNft.imageUrl}
              width={400}
              imageType={selectedNft.imageType}
              imageHeightWidthRatio={selectedNft.imageHeightWidthRatio}
            />
          ) : (
            <h4>Select your NFT from below</h4>
          )}
        </ImageWindow>
        <TextWidow>
          {selectedNft !== undefined && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <h3>
                {selectedNft.collectionName} # {selectedNft.tokenIndex}
              </h3>
              <button
                onClick={() => window.open(selectedNft.imageUrlOnChain)}
                style={{ borderRadius: "0.5rem", background: "none" }}
              >
                View on-chain
              </button>
            </div>
          )}
          <StyledTextarea
            placeholder="What's on your mind?"
            value={words}
            onChange={(e: any) => setWords(e.target.value)}
            rows={10}
            cols={40}
            maxLength={500}
          />
          {selectedNft !== undefined && selectedNft?.clubId !== "" && (
            <div style={{ display: "flex", alignItems: "center" }}>
              <p>Also post to street</p>
              <Checkbox
                checked={postToStreetChecked}
                onChange={(e) => setPostToStreetChecked(e.target.checked)}
              />
            </div>
          )}
          <ButtonWrapper>
            {normalizedMutation.isLoading ? (
              <CircularProgress />
            ) : createPostFinished ? (
              <StyledButton
                onClick={() => handleCheckPostClicked(normalizedMutation.data)}
              >
                Check your post
              </StyledButton>
            ) : (
              <StyledButton
                onClick={handlePostSubmit}
                disabled={selectedNft === undefined}
              >
                <p
                  style={{
                    whiteSpace: "nowrap",
                  }}
                >
                  Post
                </p>
              </StyledButton>
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
