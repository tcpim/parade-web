import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { StoicIdentity as stoic } from "ic-stoic-identity";
import { MouseEvent, useContext, useState } from "react";
import { AppContext, UserLoginInfo, defaultLoginInfo } from "../../App";
import { getAccountFromPrincipal } from "../../utils/principals";

const WalletConnection = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const appContext = useContext(AppContext);
  const walletConnected = appContext.userLoginInfo.walletConnected;

  const handleWalletMenuOpen = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleWalletMenuClose = () => {
    setAnchorEl(null);
  };

  const loginPlugWallet = async () => {
    await window.ic.plug.requestConnect();
    const connected = await window.ic.plug.isConnected();
    setAnchorEl(null); // close the menu dropdown

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
    setAnchorEl(null); // close the menu dropdown
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

  const handleLogout = () => {
    appContext.setUserLoginInfo(defaultLoginInfo);
    setAnchorEl(null);
  };

  const getWalletName = () => {
    if (walletConnected) {
      return appContext.userLoginInfo.walletType;
    } else {
      return "Wallet";
    }
  };

  return (
    <Box>
      <Button
        variant="contained"
        startIcon={<AccountBalanceWalletIcon />}
        onClick={handleWalletMenuOpen}
      >
        <Typography>{getWalletName()}</Typography>
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleWalletMenuClose}
      >
        {!walletConnected && (
          <MenuItem onClick={loginStoicWallet}>StoicWallet</MenuItem>
        )}
        {!walletConnected && (
          <MenuItem onClick={loginPlugWallet}>Plug</MenuItem>
        )}
        {walletConnected && <MenuItem onClick={handleLogout}>Logout</MenuItem>}
      </Menu>
    </Box>
  );
};

export default WalletConnection;
