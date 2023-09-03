import { SocialIcon } from "react-social-icons";
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

const IconButton = styled.div`
  display: flex;
  align-items: center;
  &:hover {
    cursor: pointer;
  }
`;

export const About = () => {
  const icon = (icon: any, link: string) => {
    return <IconButton onClick={() => window.open(link)}>{icon}</IconButton>;
  };

  return (
    <Wrapper>
      <StyledSection>
        <StyledHeading>Mission</StyledHeading>
        <StyledText>
          Parade's mission is to empower NFT communities in a sustainable and
          fun way. We believe that digital collectibles play an important role
          in the Web3 world, and we want to help creators and collectors build
          thriving communities around their NFTs.
        </StyledText>
      </StyledSection>
      <StyledSection>
        <StyledHeading>Roadmap</StyledHeading>
        <StyledText>
          We don't have an explicit roadmap. You, the community, will help
          define our roadmap. Please share your ideas and feedback with us on
          Twitter or Discord. However, we do have a few ideas in mind:
          <ol style={{ margin: "4px" }}>
            <li>Automatic club creation upon holder's voting</li>
            <li>
              Quantify holder loyalty by gathering information on-chain and
              off-chain
            </li>
            <li>
              Provide tools to distribute creator revenue to loyal fans, such as
              royalties
            </li>
          </ol>
          Again, we will prioritize our roadmap based on your feedback!
        </StyledText>
      </StyledSection>
      <StyledSection>
        <StyledHeading>FAQ</StyledHeading>
        <StyledText>
          <h6>What is Street and Club?</h6>
          <p>
            Club is a holder-exclusive place where NFT holders of certain
            collections can interact with each other. Street is for people to
            talk about their NFTs which don't belong to a club yet. However,
            when you create a post using a club NFT, you can also "Post to
            Street" to expand the visibility of your post.
          </p>
          <br />
          <h6>
            When I post my NFT, will my NFT be listed or transferred to
            somewhere?
          </h6>
          <p>
            No. As for now, Parade will not touch your NFT in anyway when you
            use the website. We will announce if we implement any features that
            may transfer/list your NFT. That being said, we recommend you to use
            Plug wallet because it will warn you whenever you are about to sign
            a transaction that may transfer your asset. See:
            <a href="https://docs.plugwallet.ooo/resources/app-trust-and-security/">
              https://docs.plugwallet.ooo/resources/app-trust-and-security/
            </a>
          </p>
        </StyledText>
      </StyledSection>

      <StyledSection>
        <StyledHeading>Contact Us</StyledHeading>
        <StyledText>
          We're always looking for ways to improve. If you have any questions,
          suggestions and feedback, please contact us at
        </StyledText>
        <div style={{ display: "flex", gap: "8px" }}>
          <IconButton
            onClick={() => window.open("https://twitter.com/parade_web3")}
          >
            <SocialIcon network="twitter" style={{ height: 25, width: 25 }} />
          </IconButton>
          <IconButton
            onClick={() => window.open("https://discord.gg/6p2vw4ZfMg")}
          >
            <SocialIcon network="discord" style={{ height: 25, width: 25 }} />
          </IconButton>
        </div>
      </StyledSection>
    </Wrapper>
  );
};
