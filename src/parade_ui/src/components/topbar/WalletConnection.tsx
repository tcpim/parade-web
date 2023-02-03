import Button from '@mui/material/Button';
import { Box } from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { MouseEvent, useState, useMemo } from 'react';
import Typography from '@mui/material/Typography';
import { AppContext, UserLoginInfo } from '../../App';
import { useContext } from 'react';

const WalletConnection = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const appContext = useContext(AppContext)
    const walletConnected = appContext.userLoginInfo.walletConnected

    const handleWalletMenuOpen = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleWalletMenuClose = () => {
        setAnchorEl(null);
    };

    const handleOnClickPlug = async () => {
        await window.ic.plug.requestConnect();
        const connected = await window.ic.plug.isConnected();
        setAnchorEl(null) // close the menu dropdown

        // update app context
        if (connected) {
            const userLoginInfo: UserLoginInfo = {
                userPid: window.ic.plug.principalId,
                //userPid: "yrwna-bkgxs-vuzuw-lheqr-357oj-n4yiz-2zdjx-icv63-jgoqb-pmf3m-qqe", // stoic pid
                walletConnected: true,
                walletType: 'Plug'
            }
            appContext.setUserLoginInfo(userLoginInfo)
        }
    }

    const handleLogout = () => {
        appContext.setUserLoginInfo({
            userPid: "",
            walletConnected: false,
            walletType: ""
        })
        setAnchorEl(null)
    }

    const getWalletName = useMemo(() => {
        if (walletConnected) {
            return appContext.userLoginInfo.walletType
        } else {
            return "Wallet"
        }
    }, [walletConnected])

    return (
        <Box>

            <Button variant="contained" sx={{ margin: '4px' }} onClick={handleWalletMenuOpen}>
                <Typography>{getWalletName}</Typography>
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleWalletMenuClose}
            >
                <MenuItem onClick={handleWalletMenuClose}>StoicWallet</MenuItem>
                {!walletConnected && <MenuItem onClick={handleOnClickPlug}>Plug</MenuItem>}
                {walletConnected && <MenuItem onClick={handleLogout}>Logout</MenuItem>}
            </Menu>
        </Box>
    )
}

export default WalletConnection