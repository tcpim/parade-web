import { useContext, useEffect, useState } from 'react'
import { Box } from '@mui/material';
import { AppContext } from '../../App';
import Typography from '@mui/material/Typography';
import { getAllUserNFTs, getNFTInfo, getNFTActor, NFTCollection, getCachedUserNFTs } from '@psychedelic/dab-js';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import CardContent from '@mui/material/CardContent';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { CollectionList } from './CollectionList'
import CircularProgress from '@mui/material/CircularProgress';


const UserPortfolio = () => {
    const appContext = useContext(AppContext)

    // Legacy code to use dab-js to fetch nft data
    // useEffect(() => {
    //     const fetchCollections = async () => {
    //         const collectionsPlug = await getCachedUserNFTs({
    //             userPID: appContext.userLoginInfo.userPid,
    //             refresh: false,
    //         });
    //         setUserCollections(collectionsPlug)
    //         var collectionExpandedState: boolean[] = new Array(collectionsPlug.length).fill(true)
    //         setIsExpanded(collectionExpandedState)
    //     }
    //     fetchCollections()
    // }, [appContext])

    if (!appContext.userLoginInfo.walletConnected) {
        return (
            <Box bgcolor='rgba(251, 18, 18, 0.2)' sx={{ flexBasis: '85%', marginLeft: "15%", marginTop: "5%", overflow: "auto" }}>
                Please connect to wallet to see your portfolio
            </Box>
        )
    }

    return (
        <Box bgcolor='rgba(251, 18, 18, 0.2)' sx={{ flexBasis: '85%', marginLeft: "15%", marginTop: "5%", overflow: "auto" }}>
            <CollectionList userAccount={appContext.userLoginInfo.userAccount} />
        </Box>
    )
}

export default UserPortfolio