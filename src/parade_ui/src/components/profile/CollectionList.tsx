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



const CollectionList = () => {
    return (
        <div></div>
        // <List>
        //     {userCollections.map((collection, index) => (
        //         <Box key={collection.canisterId}>
        //             <ListItemButton onClick={(el) => handleCollectionExpansionClick(index)}>
        //                 <Avatar src={collection.icon} sx={{ marginRight: 2 }} />
        //                 <ListItemText primary={collection.name.concat(" (" + collection.tokens.length + ")")} />
        //                 {isExpanded[index] ? <ExpandLess /> : <ExpandMore />}
        //             </ListItemButton>
        //             <Collapse in={isExpanded[index]} timeout="auto" >
        //                 <Stack direction="row" sx={{ ml: 1, flexWrap: "wrap" }}>
        //                     {collection.tokens.map(token => (
        //                         <NftCard key={token.index.toString()} data={{
        //                             imageUrl: token.url,
        //                             index: token.index.toString(),
        //                             name: token.name,
        //                             standard: token.standard,
        //                             canisterId: collection.canisterId
        //                         }} />
        //                     ))}
        //                 </Stack>
        //             </Collapse>
        //         </Box>
        //     ))}
        // </List>
    )
}