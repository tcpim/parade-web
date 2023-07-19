import { AiOutlineArrowRight } from "react-icons/ai";
import { useNavigate, useParams } from "react-router-dom";
import { styled } from "styled-components";
import { ClubFeed } from "./ClubFeed";
import { ClubTweet } from "./ClubTweet";
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 10%;
  margin-top: 3rem;
  margin-right: 20%;
`;

const ButtonRow = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
  margin-bottom: 1rem;
`;

const StyledButton = styled.button`
  height: 3rem;
  border-radius: 0.5rem;
  border: none;
  display: flex;
  gap: 0.5rem;
  align-items: center;
  background-color: rgba(255, 56, 92, 1);
  color: white;
  padding: 0.5rem;
`;

export const ClubPage = () => {
  const { clubId } = useParams();
  const navigate = useNavigate();

  return (
    <Wrapper>
      <ButtonRow>
        <StyledButton onClick={() => navigate("/clubs/" + clubId + "/chat")}>
          Go to chat room <AiOutlineArrowRight />
        </StyledButton>
      </ButtonRow>
      <ClubTweet clubId={clubId ?? ""} />
      <ClubFeed />
    </Wrapper>
  );
};
