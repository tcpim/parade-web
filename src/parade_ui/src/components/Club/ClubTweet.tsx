import { CircularProgress } from "@mui/material";
import { useContext, useState } from "react";
import { styled } from "styled-components";
import { AppContext } from "../../App";
import { useCreateClubPost } from "../../hooks/create-post/useCreateClubPost";

const Wrapper = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const StyledButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const StyledTextarea = styled.textarea`
  resize: none;
  width: 40rem;
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
      <StyledTextarea
        value={words}
        rows={4}
        cols={50}
        placeholder="What's on your mind about this club?"
        onChange={(e: any) => setWords(e.target.value)}
        maxLength={500}
      />
      <StyledButtonRow>
        {createPostMutation.isLoading ? (
          <CircularProgress />
        ) : (
          <StyledButton type="submit" disabled={words.length === 0}>
            Post
          </StyledButton>
        )}
      </StyledButtonRow>
    </Wrapper>
  );
};
