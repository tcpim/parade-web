import Masonry from "@mui/lab/Masonry";
import { Box, ImageList, ImageListItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import boxydude from "../../../assets/boxydude-club.png";
import btcflower from "../../../assets/btcflower-club.png";
import cubetopia from "../../../assets/cubetopia-club.png";
import dscvr from "../../../assets/dscvr-airdrop-club.png";
import icpunks from "../../../assets/icpunk-club.png";
import motoko from "../../../assets/motoko-ghost-club.png";
import pokedbot from "../../../assets/poked-bots-club.png";

const ClubList = () => {
  const navigate = useNavigate();

  return (
    <ImageList sx={{ width: "100%", height: "100%" }} cols={3} rowHeight={30}>
      <Box onClick={() => navigate("/clubs/ludo-arts")}>
        <ImageListItem>
          <img src={btcflower} loading="lazy" />
        </ImageListItem>
      </Box>
      <Box onClick={() => navigate("/clubs/poked-bots")}>
        <ImageListItem>
          <img src={pokedbot} loading="lazy" />
        </ImageListItem>
      </Box>
      <Box onClick={() => navigate("/clubs/motoko-ghost")}>
        <ImageListItem>
          <img src={motoko} loading="lazy" />
        </ImageListItem>
      </Box>
    </ImageList>
  );
};

const Wrapper = styled.div`
  margin-left: auto;
  margin-right: auto;
  width: 80%;
`;

const ImageBlock = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

export const ClubsGrid = () => {
  const navigate = useNavigate();

  const width = "100%";
  return (
    <Wrapper>
      <Masonry columns={3}>
        <ImageBlock onClick={() => navigate("/clubs/ludo-arts")}>
          <img src={btcflower} loading="lazy" width={width} />
        </ImageBlock>
        <ImageBlock onClick={() => navigate("/clubs/poked-bots")}>
          <img src={pokedbot} loading="lazy" width={width} />
        </ImageBlock>
        <ImageBlock onClick={() => navigate("/clubs/motoko-ghost")}>
          <img src={motoko} loading="lazy" width={width} />
        </ImageBlock>
        <ImageBlock onClick={() => navigate("/clubs/motoko-ghost")}>
          <img src={icpunks} loading="lazy" width={width} />
        </ImageBlock>
        <ImageBlock onClick={() => navigate("/clubs/motoko-ghost")}>
          <img src={boxydude} loading="lazy" width={width} />
        </ImageBlock>
        <ImageBlock onClick={() => navigate("/clubs/motoko-ghost")}>
          <img src={dscvr} loading="lazy" width={width} />
        </ImageBlock>
        <ImageBlock onClick={() => navigate("/clubs/motoko-ghost")}>
          <img src={cubetopia} loading="lazy" width={width} />
        </ImageBlock>
      </Masonry>
    </Wrapper>
  );
};
