import { styled } from "styled-components";

const Wrapper = styled.div`
  margin: 5rem 10rem;
`;

const StyledSection = styled.div`
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
`;

const StyledHeading = styled.h2`
  color: #333;
  margin-bottom: 10px;
`;

const StyledText = styled.p`
  font-size: 16px;
  line-height: 1.5;
  color: #555;
`;

export const About = () => {
  return (
    <Wrapper>
      <StyledSection>
        <StyledHeading>Mission</StyledHeading>
        <StyledText>
          Our company was founded on the principle of XYZ. We believe in ABC and
          strive to DEF. Our core mission is to provide unparalleled service,
          innovate in our field, and bring value to our stakeholders. We exist
          because of GHI, and we're proud to serve our community and beyond.
        </StyledText>
      </StyledSection>
      <StyledSection>
        <StyledHeading>Roadmap</StyledHeading>
        <StyledText>
          As we look to the future, we're excited about several upcoming
          milestones:
        </StyledText>
      </StyledSection>

      <StyledSection>
        <StyledHeading>Contact Us</StyledHeading>
        <StyledText>
          We're always eager to hear from you. Whether it's feedback, questions,
          or any other inquiries, feel free to reach out!
        </StyledText>
      </StyledSection>
    </Wrapper>
  );
};
