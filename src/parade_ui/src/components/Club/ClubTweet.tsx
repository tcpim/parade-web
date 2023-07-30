import { CircularProgress, TextField } from "@mui/material";
import { useContext, useState } from "react";
import { styled } from "styled-components";
import { AppContext } from "../../App";
import { useCreateClubPost } from "../../hooks/create-post/useCreateClubPost";
import { useUserCollectionListForClub } from "../../hooks/fetch-nft-data/useUserCollectionListForClub";
import { MAX_CLUB_POST_WORDS_LENGTH } from "../../utils/constants";

const Wrapper = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 60%;
`;

const StyledButtonRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const StyledButton = styled.button`
  width: 5rem;
  height: 2rem;
  border-radius: 0.5rem;
  background-color: white;
  border-color: ${(props) =>
    props.disabled ? "none" : "rgba(255, 56, 92, 1)"};
`;

interface ClubTweetProps {
  clubId: string;
}
export const ClubTweet = ({ clubId }: ClubTweetProps) => {
  const appContext = useContext(AppContext);
  const query = useUserCollectionListForClub(
    appContext.userLoginInfo.userAccount,
    clubId ?? ""
  );
  const belong = query.data?.tokenCount !== 0;

  const [words, setWords] = useState("");

  const createPostMutation = useCreateClubPost({
    userPid: appContext.userLoginInfo.userPid,
    words,
    inPublic: false,
    clubId: clubId,
    onSuccessCallback: () => setWords(""),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createPostMutation.mutate();
  };

  return (
    <Wrapper onSubmit={handleSubmit}>
      <TextField
        value={words}
        placeholder={
          belong
            ? "What's on your mind about this club?"
            : "You can't post because you are not a member of this club"
        }
        onChange={(e) => setWords(e.target.value)}
        fullWidth
        multiline
        disabled={!belong}
        error={words.length > MAX_CLUB_POST_WORDS_LENGTH}
        helperText={
          words.length > MAX_CLUB_POST_WORDS_LENGTH ? "Max 500 characters" : ""
        }
      />
      <StyledButtonRow>
        {createPostMutation.isLoading ? (
          <CircularProgress />
        ) : (
          <StyledButton type="submit" disabled={words.length === 0 || !belong}>
            Post
          </StyledButton>
        )}
      </StyledButtonRow>
    </Wrapper>
  );
};
