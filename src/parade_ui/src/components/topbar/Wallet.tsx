import * as Menubar from "@radix-ui/react-menubar";
import { BiWalletAlt } from "react-icons/bi";
import styled from "styled-components";

const ConnectWalletButton = styled(Menubar.Trigger)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 9rem;
  height: 3rem;
  color: white;
  background-color: rgba(255, 56, 92, 1);
  border-radius: 0.5rem;
  border: none;
`;

export const Wallet = () => {
  return (
    <Menubar.Root>
      <Menubar.Menu>
        <ConnectWalletButton>
          <BiWalletAlt size="1.2rem" />
          Connect Wallet
        </ConnectWalletButton>
        <Menubar.Portal>
          <Menubar.Content align="start" sideOffset={5} alignOffset={-3}>
            <Menubar.Item>Plug</Menubar.Item>
            <Menubar.Item>Stoic</Menubar.Item>
          </Menubar.Content>
        </Menubar.Portal>
      </Menubar.Menu>
    </Menubar.Root>
  );
};
