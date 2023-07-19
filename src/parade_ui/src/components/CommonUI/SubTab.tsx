import { styled } from "styled-components";

export const SubTabDiv = styled.div`
  display: flex;
  justify-content: space-around;
  margin: 2rem 5rem;
  gap: 2rem;
  align-self: center;
`;

interface SubTabButtonProps {
  selected: boolean;
}

export const SubTabButton = styled.button<SubTabButtonProps>`
  border: none;
  width: 10rem;
  height: 3rem;
  font-size: large;
  background-color: transparent;
  border-bottom: 2px solid
    ${(props) => (props.selected ? "rgba(255, 56, 92, 1)" : "none")};
  &:hover {
    background-color: #c4c2c2;
    cursor: pointer;
  }
`;
