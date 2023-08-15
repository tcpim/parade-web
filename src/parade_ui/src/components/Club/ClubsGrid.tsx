import Masonry from "@mui/lab/Masonry";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import boxydude from "../../../assets/boxydude-club.png";
import btcflower from "../../../assets/btcflower-club.png";
import cubetopia from "../../../assets/cubetopia-club.png";
import dscvr from "../../../assets/dscvr-airdrop-club.png";
import icpunks from "../../../assets/icpunk-club.png";
import motoko from "../../../assets/motoko-ghost-club.png";
import pokedbot from "../../../assets/poked-bots-club.png";

const Wrapper = styled.div`
  margin-left: auto;
  margin-right: auto;
  width: 70%;
`;

const ImageBlock = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

export const ClubsGrid = () => {
  const navigate = useNavigate();

  const isSmallScreen = useMediaQuery({ query: "(max-width: 768px)" });

  console.log("isSmallScreen", isSmallScreen);
  const width = "100%";
  return (
    <Wrapper>
      <Masonry columns={isSmallScreen ? 1 : 3}>
        <ImageBlock onClick={() => navigate("/clubs/ludo-arts")}>
          <img src={btcflower} loading="lazy" width={width} />
        </ImageBlock>
        <ImageBlock onClick={() => navigate("/clubs/poked-bots")}>
          <img src={pokedbot} loading="lazy" width={width} />
        </ImageBlock>
        <ImageBlock onClick={() => navigate("/clubs/motoko-ghost")}>
          <img src={motoko} loading="lazy" width={width} />
        </ImageBlock>
        <ImageBlock onClick={() => navigate("/clubs/ic-punks")}>
          <img src={icpunks} loading="lazy" width={width} />
        </ImageBlock>
        <ImageBlock onClick={() => navigate("/clubs/boxy-dude")}>
          <img src={boxydude} loading="lazy" width={width} />
        </ImageBlock>
        <ImageBlock onClick={() => navigate("/clubs/dscvr-airdrop")}>
          <img src={dscvr} loading="lazy" width={width} />
        </ImageBlock>
        <ImageBlock onClick={() => navigate("/clubs/cubetopia")}>
          <img src={cubetopia} loading="lazy" width={width} />
        </ImageBlock>
      </Masonry>
    </Wrapper>
  );
};
