import { useContext } from "react";
import { AppContext } from "../../../App";
import { ProfileMenu } from "./ProfileMenu";
import { WalletMenu } from "./WalletMenu";

export const WalletProfile = () => {
  const appContext = useContext(AppContext);
  const walletConnected = appContext.userLoginInfo.walletConnected;

  if (!walletConnected) {
    return <WalletMenu />;
  } else {
    return <ProfileMenu />;
  }
};
