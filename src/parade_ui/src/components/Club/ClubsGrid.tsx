import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
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

const imageList = [
  { img: btcflower, url: "/clubs/ludo-arts" },
  { img: pokedbot, url: "/clubs/poked-bots" },
  { img: motoko, url: "/clubs/motoko-ghost" },
  { img: icpunks, url: "/clubs/ic-punks" },
  { img: boxydude, url: "/clubs/boxy-dude" },
  { img: dscvr, url: "/clubs/dscvr-airdrop" },
  { img: cubetopia, url: "/clubs/cubetopia" },
];

const StyledImageItem = styled(ImageListItem)`
  cursor: pointer;
`;

export const ClubsGrid = () => {
  const navigate = useNavigate();

  return (
    <Wrapper>
      <ImageList cols={3} variant="masonry" gap={10}>
        {imageList.map((image, index) => (
          <StyledImageItem key={index} onClick={() => navigate(image.url)}>
            <img
              src={`${image.img}?w=248&fit=crop&auto=format`}
              srcSet={`${image.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
            />
          </StyledImageItem>
        ))}
      </ImageList>
    </Wrapper>
  );
};
