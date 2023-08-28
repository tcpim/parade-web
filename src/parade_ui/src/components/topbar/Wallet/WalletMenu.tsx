import * as amplitude from "@amplitude/analytics-browser";
import { Identity } from "@dfinity/agent";
import * as Menubar from "@radix-ui/react-menubar";
import { StoicIdentity as stoic } from "ic-stoic-identity";
import { useContext } from "react";
import { BiWalletAlt } from "react-icons/bi";
import styled from "styled-components";
import { CANISTER_LIST } from "../../../../backend_declarations/config";
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

  const connectObj: any = {
    whitelist: CANISTER_LIST,
  };

  // No longer need this since we are skipping using wallet identity in local testing
  // But when we want to test with wallet identity,
  // uncomment this and switch to plug local network
  // if (process.env.NODE_ENV !== "production") {
  //   connectObj["host"] = "http://127.0.0.1:8000";
  // }

  const loginPlugWallet = async () => {
    await window.ic.plug.requestConnect(connectObj);
    const connected = await window.ic.plug.isConnected();

    if (connected) {
      const userLoginInfo: UserLoginInfo = {
        userPid: window.ic.plug.principalId,
        userAccount: getAccountFromPrincipal(window.ic.plug.principalId),
        walletConnected: true,
        walletType: "plug",
      };
      appContext.setUserLoginInfo(userLoginInfo);

      amplitude.setUserId(window.ic.plug.principalId);
      amplitude.track("connect_wallet", { wallet: "plug" });
    } else {
      throw new Error("Failed to connect with Plug");
    }
  };

  const loginStoicWallet = async () => {
    let identity: Identity = await stoic.load();
    if (!identity) {
      identity = await stoic.connect();
    }

    const userPrincipalId = identity.getPrincipal().toText();
    appContext.setUserLoginInfo({
      userPid: userPrincipalId,
      userAccount: getAccountFromPrincipal(userPrincipalId),
      walletConnected: true,
      walletType: "stoic",
      identity: identity,
    });

    amplitude.setUserId(userPrincipalId);
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
