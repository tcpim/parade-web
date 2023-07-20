import { Divider } from "@mui/material";
import { styled } from "styled-components";
import { ClubSidebar } from "./ClubSideBar";

const Wrapper = styled.div`
  display: grid;
  position: relative;
  grid-template-columns: 1fr 1px 20rem;
  margin-left: 5%;
  margin-top: 3rem;
  gap: 2rem;
`;

interface ClubLayoutProps {
  children: React.ReactNode;
}

export const ClubLayout = ({ children }: ClubLayoutProps) => {
  return (
    <Wrapper>
      {children}
      <Divider orientation="vertical" flexItem />
      <ClubSidebar />
    </Wrapper>
  );
};
