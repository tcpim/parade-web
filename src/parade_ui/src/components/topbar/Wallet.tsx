import { CircularProgress } from "@mui/material";
import * as Menubar from "@radix-ui/react-menubar";
import { StoicIdentity as stoic } from "ic-stoic-identity";
import { useContext } from "react";
import { BiWalletAlt } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { AppContext, UserLoginInfo, defaultLoginInfo } from "../../App";
import { useGetUser } from "../../hooks/user/useGetUser";
import { getAccountFromPrincipal } from "../../utils/principals";
import { UserAvatar } from "../Profile/Avatar";

const buttonWidth = "9rem";
const buttonHeight = "3rem";

const CommonTrigger = styled(Menubar.Trigger)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: ${buttonWidth};
  height: ${buttonHeight};
`;

const CommonContent = styled(Menubar.Content)`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: ${buttonWidth};
  border: 1px solid red;
  background-color: white;
  border-radius: 0.5rem;
`;

const CommonItem = styled(Menubar.Item)`
  width: 100%;
  padding: 0.5rem 2rem;
  text-align: center;
  &[data-highlighted] {
    background-color: rgba(171, 169, 169, 0.8);
    outline: none;
  }
`;
const ConnectWalletTrigger = styled(CommonTrigger)`
  color: white;
  background-color: rgba(255, 56, 92, 1);
  border-radius: 0.5rem;
  border: none;
`;

const WalletListContent = styled(CommonContent)``;

const WalletListItem = styled(CommonItem)`
  width: 100%;
  padding: 0.5rem 2rem;
  text-align: center;
  &[data-highlighted] {
    background-color: rgba(171, 169, 169, 0.8);
    outline: none;
  }
`;

const ConnectWallet = () => {
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
    } else {
      throw new Error("Failed to connect with Plug");
    }
  };

  const loginStoicWallet = async () => {
    const isLoaded = await stoic.load();

    if (isLoaded !== false) {
      appContext.setUserLoginInfo({
        userPid: isLoaded.getPrincipal().toText(),
        userAccount: getAccountFromPrincipal(isLoaded.getPrincipal().toText()),
        walletConnected: true,
        walletType: "Stoic",
      });
    } else {
      const identity = await stoic.connect();
      appContext.setUserLoginInfo({
        userPid: identity.getPrincipal().toText(),
        userAccount: getAccountFromPrincipal(identity.getPrincipal().toText()),
        walletConnected: true,
        walletType: "Stoic",
      });
    }
  };

  return (
    <Menubar.Root>
      <Menubar.Menu>
        <ConnectWalletTrigger>
          <BiWalletAlt size="1.2rem" />
          Connect Wallet
        </ConnectWalletTrigger>
        <Menubar.Portal>
          <WalletListContent sideOffset={10} align="center">
            <WalletListItem onClick={loginPlugWallet}>Plug</WalletListItem>
            <Menubar.Separator>
              <div style={{ border: "1px solid gray", width: "6rem" }}></div>
            </Menubar.Separator>
            <WalletListItem onClick={loginStoicWallet}>Stoic</WalletListItem>
          </WalletListContent>
        </Menubar.Portal>
      </Menubar.Menu>
    </Menubar.Root>
  );
};

const ProfileTrigger = styled(CommonTrigger)`
  background-color: white;
  border-radius: 0.5rem;
  border: 2px solid rgba(255, 56, 92, 1);
`;

const ProfileContent = styled(CommonContent)``;

const ProfileContentItem = styled(CommonItem)``;

const ProfileButton = () => {
  const navigate = useNavigate();
  const appContext = useContext(AppContext);
  const userQuery = useGetUser(appContext.userLoginInfo.userPid);

  if (userQuery.isLoading) {
    return <CircularProgress />;
  } else if (userQuery.isError) {
    return <div>Try again</div>;
  }

  const avatar = userQuery.data?.avatar;
  const username = userQuery.data?.username;
  const userId = userQuery.data?.userId;

  const handleLogout = () => {
    appContext.setUserLoginInfo(defaultLoginInfo);
  };

  return (
    <Menubar.Root>
      <Menubar.Menu>
        <ProfileTrigger>
          <UserAvatar userId={userId} size={36} />
          {username}
        </ProfileTrigger>
        <Menubar.Portal>
          <ProfileContent sideOffset={10} align="center">
            <ProfileContentItem onClick={() => navigate("/profile")}>
              Profile
            </ProfileContentItem>
            <Menubar.Separator>
              <div style={{ border: "1px solid gray", width: "6rem" }}></div>
            </Menubar.Separator>
            <ProfileContentItem onClick={handleLogout}>
              Log out
            </ProfileContentItem>
          </ProfileContent>
        </Menubar.Portal>
      </Menubar.Menu>
    </Menubar.Root>
  );
};

export const Wallet = () => {
  const appContext = useContext(AppContext);
  const walletConnected = appContext.userLoginInfo.walletConnected;

  if (!walletConnected || true) {
    return <ConnectWallet />;
  } else {
    return <ProfileButton />;
  }
};
