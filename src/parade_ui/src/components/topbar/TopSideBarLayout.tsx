import { ReactNode } from "react";
import styled from "styled-components";
import { NavBar } from "./NavBar";
import { TopBar } from "./TopBar";

interface IconProps {
  size: number;
  bold: boolean;
}
export const Icon = styled.svg<IconProps>`
  stroke-width: ${(props) => (props.bold ? "2px" : "1.5px")};
  width: ${(props) => props.size}rem;
  height: ${(props) => props.size}rem;
`;

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 15rem 1fr;
  grid-template-rows: 5rem 1fr;
  grid-template-areas:
    "topbar topbar"
    "navbar main-content";
  isolation: isolate;
`;

const StyledTopBar = styled(TopBar)`
  grid-area: topbar;
  position: fixed;
  padding-top: 1rem;
  width: 100%;
  z-index: 2;
  background-color: white;
  border-bottom: 1px solid #c4c1c1;
  padding-bottom: 1rem;
`;

const StyledNavBar = styled(NavBar)`
  grid-area: navbar;
  position: fixed;
  top: 5em;
  height: 100%;
`;

const StyledChildren = styled.div`
  grid-area: main-content;
  z-index: 1;
`;

interface TopSideBarProps {
  children: ReactNode;
}

export const TopSideBarLayout = ({ children }: TopSideBarProps) => {
  return (
    <Wrapper>
      <StyledTopBar />
      <StyledNavBar />
      <StyledChildren>{children}</StyledChildren>
    </Wrapper>
  );
};
