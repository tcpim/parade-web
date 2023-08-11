import * as amplitude from "@amplitude/analytics-browser";
import * as Menubar from "@radix-ui/react-menubar";
import { StoicIdentity as stoic } from "ic-stoic-identity";
import { useContext } from "react";
import { BiWalletAlt } from "react-icons/bi";
import styled from "styled-components";
import { AppContext, UserLoginInfo } from "../../../App";
import { getAccountFromPrincipal } from "../../../utils/principals";
import { CommonContent, CommonItem, CommonTrigger } from "./menuStyles";

const ConnectWalletTrigger = styled(CommonTrigger)`
  color: white;
  background-color: rgba(255, 56, 92, 1);
  border: none;
`;

export const WalletMenu = () => {
  const appContext = useContext(AppContext);
  const walletConnected = appContext.userLoginInfo.walletConnected;

  const loginPlugWallet = async () => {
    await window.ic.plug.requestConnect();
    const connected = await window.ic.plug.isConnected();

    if (connected) {
      const userLoginInfo: UserLoginInfo = {
        userPid: window.ic.plug.principalId,
        userAccount: getAccountFromPrincipal(window.ic.plug.principalId),
        walletConnected: true,
        walletType: "Plug",
      };
      appContext.setUserLoginInfo(userLoginInfo);

      amplitude.setUserId(window.ic.plug.principalId);
      amplitude.track("connect_wallet", { wallet: "plug" });
    } else {
      throw new Error("Failed to connect with Plug");
    }
  };

  const loginStoicWallet = async () => {
    const isLoaded = await stoic.load();

    let userId = "";
    if (isLoaded !== false) {
      userId = isLoaded.getPrincipal().toText();
      appContext.setUserLoginInfo({
        userPid: userId,
        userAccount: getAccountFromPrincipal(isLoaded.getPrincipal().toText()),
        walletConnected: true,
        walletType: "Stoic",
      });
    } else {
      const identity = await stoic.connect();
      userId = identity.getPrincipal().toText();
      appContext.setUserLoginInfo({
        userPid: userId,
        userAccount: getAccountFromPrincipal(identity.getPrincipal().toText()),
        walletConnected: true,
        walletType: "Stoic",
      });
    }

    amplitude.setUserId(userId);
    amplitude.track("connect_wallet", { wallet: "stoic" });
  };

  return (
    <Menubar.Root>
      <Menubar.Menu>
        <ConnectWalletTrigger>
          <BiWalletAlt size="1.2rem" />
          Connect Wallet
        </ConnectWalletTrigger>
        <Menubar.Portal>
          <CommonContent sideOffset={10} align="center">
            <CommonItem onClick={loginPlugWallet}>Plug</CommonItem>
            <Menubar.Separator>
              <div style={{ border: "1px solid gray", width: "6rem" }}></div>
            </Menubar.Separator>
            <CommonItem onClick={loginStoicWallet}>Stoic</CommonItem>
          </CommonContent>
        </Menubar.Portal>
      </Menubar.Menu>
    </Menubar.Root>
  );
};
