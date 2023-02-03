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


interface NftCardProps {
    data: {
        index: string,
        name?: string,
        imageUrl: string,
        standard: string,
        canisterId: string
    }
}

const NftCard = ({ data }: NftCardProps) => {
    const CardContentNoPadding = styled(CardContent)(`
        padding: 0;
        &:last-child {
            padding-bottom: 0px;
        };
        display: flex;
        justify-content: space-between;
        button {
            justify-content: center;
            min-width: 25%;
        }
        & .MuiTypography-root {
            display:flex;
            flex-direction: column;
            justify-content: center;
        }
    `);

    const svgCanisters = new Set<string>([
        "skjpp-haaaa-aaaae-qac7q-cai",
        "pk6rk-6aaaa-aaaae-qaazq-cai",
    ])

    const MediaComponent = () => {
        if (data.imageUrl.endsWith(".mp4")) {
            return (
                <CardMedia
                    component="video"
                    src={data.imageUrl}
                    autoPlay
                    controls loop
                />
            )
        } else if (svgCanisters.has(data.canisterId)) {
            return (
                <CardMedia
                    component="iframe"
                    height="300"
                    src={data.imageUrl}
                />
            )
        } else {
            return (
                <CardMedia
                    component="img"
                    image={data.imageUrl}
                    height="300"
                    width="300"
                />
            )
        }
    }


    return (
        <Card sx={{ maxWidth: 350, mr: 1, mt: 1 }}>
            {MediaComponent()}
            <CardContentNoPadding>
                <Typography variant="subtitle2" component="div">
                    {data.name ? data.name : "#".concat(data.index)}
                </Typography>
                <Button size="small" color="primary">
                    <AddIcon />
                </Button>
            </CardContentNoPadding>
        </Card>
    )
}

const UserPortfolio = () => {
    const appContext = useContext(AppContext)
    const [userCollections, setUserCollections] = useState<NFTCollection[]>([])
    const [isExpanded, setIsExpanded] = useState<boolean[]>([])

    useEffect(() => {
        const fetchCollections = async () => {
            const collectionsPlug = await getCachedUserNFTs({
                userPID: appContext.userLoginInfo.userPid,
                refresh: false,
            });
            setUserCollections(collectionsPlug)
            var collectionExpandedState: boolean[] = new Array(collectionsPlug.length).fill(true)
            setIsExpanded(collectionExpandedState)
        }
        fetchCollections()
    }, [appContext])

    const handleCollectionExpansionClick = (index: number) => {
        const newExpandedState = isExpanded.map((v, i) => {
            if (i == index) {
                return !v
            } else {
                return v
            }
        })
        setIsExpanded(newExpandedState)
    }

    if (!appContext.userLoginInfo.walletConnected) {
        return (
            <Box bgcolor='rgba(251, 18, 18, 0.2)' sx={{ flexBasis: '85%', marginLeft: "15%", marginTop: "5%", overflow: "auto" }}>
                Please connect to wallet to see your portfolio
            </Box>
        )
    }

    return (
        <Box bgcolor='rgba(251, 18, 18, 0.2)' sx={{ flexBasis: '85%', marginLeft: "15%", marginTop: "5%", overflow: "auto" }}>
            <Typography>User Portfolio for {appContext.userLoginInfo.userPid}</Typography>
            <List>
                {userCollections.map((collection, index) => (
                    <Box key={collection.canisterId}>
                        <ListItemButton onClick={(el) => handleCollectionExpansionClick(index)}>
                            <Avatar src={collection.icon} sx={{ marginRight: 2 }} />
                            <ListItemText primary={collection.name.concat(" (" + collection.tokens.length + ")")} />
                            {isExpanded[index] ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                        <Collapse in={isExpanded[index]} timeout="auto" >
                            <Stack direction="row" sx={{ ml: 1, flexWrap: "wrap" }}>
                                {collection.tokens.map(token => (
                                    <NftCard key={token.index.toString()} data={{
                                        imageUrl: token.url,
                                        index: token.index.toString(),
                                        name: token.name,
                                        standard: token.standard,
                                        canisterId: collection.canisterId
                                    }} />
                                ))}
                            </Stack>
                        </Collapse>
                    </Box>
                ))}
            </List>
        </Box>
    )
}

export default UserPortfolio