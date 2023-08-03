import { useErrorBoundary } from "react-error-boundary";
import { AiOutlineArrowRight } from "react-icons/ai";
import { useNavigate, useParams } from "react-router-dom";
import { styled } from "styled-components";
import { ClubFeed } from "./ClubFeed";
import { ClubLayout } from "./ClubLayout";
import { ClubTweet } from "./ClubTweet";

const ClubMain = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
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
  const { showBoundary } = useErrorBoundary();

  if (clubId === undefined) {
    showBoundary(new Error("clubId is undefined"));
  }

  return (
    <ClubLayout clubId={clubId ?? ""}>
      <ClubMain>
        <ButtonRow>
          <StyledButton onClick={() => navigate("/clubs/" + clubId + "/chat")}>
            Go to chat room <AiOutlineArrowRight />
          </StyledButton>
        </ButtonRow>
        <ClubTweet clubId={clubId} />
        <ClubFeed />
      </ClubMain>
    </ClubLayout>
  );
};
