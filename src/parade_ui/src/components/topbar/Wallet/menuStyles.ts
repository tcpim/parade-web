import * as Menubar from "@radix-ui/react-menubar";
import styled from "styled-components";

const buttonWidth = "9rem";
const buttonHeight = "3rem";

export const CommonTrigger = styled(Menubar.Trigger)`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: ${buttonWidth};
  height: ${buttonHeight};
  border-radius: 0.5rem;

  &[data-highlighted] {
    outline: none;
  }
`;

export const CommonContent = styled(Menubar.Content)`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: ${buttonWidth};
  border: 1px solid red;
  background-color: white;
  border-radius: 0.5rem;
`;

export const CommonItem = styled(Menubar.Item)`
  width: 100%;
  padding: 0.5rem 2rem;
  text-align: center;
  &[data-highlighted] {
    background-color: rgba(171, 169, 169, 0.8);
    outline: none;
  }
`;
