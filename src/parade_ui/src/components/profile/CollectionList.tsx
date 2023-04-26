import { useUserCollectionList } from '../../data/useUserCollectionList'
import { useContext, useEffect, useState } from 'react'
import { Box } from '@mui/material';
import { AppContext } from '../../App';
import Typography from '@mui/material/Typography';
import { getAllUserNFTs, getNFTInfo, getNFTActor, NFTCollection, getCachedUserNFTs } from '@psychedelic/dab-js';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import CardContent from '@mui/material/CardContent';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import CircularProgress from '@mui/material/CircularProgress';
import { CollectionListData, Collection, Token } from '../../data/useUserCollectionList';

interface NftCardProps {
    data: {
        index: string,
        name?: string,
        imageUrl: string,
        standard?: string,
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

interface CollectionListProps {
    userAccount: string;
}

export const CollectionList = ({ userAccount }: CollectionListProps) => {
    const { data, isLoading, isError, error } = useUserCollectionList(userAccount);
    const [isExpanded, setIsExpanded] = useState<boolean[]>([])

    useEffect(() => {
        var collectionExpandedState: boolean[] = new Array(data?.result.length).fill(true)
        setIsExpanded(collectionExpandedState)
    }, [userAccount, data])

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        )
    } else if (isError) {
        throw new Error('Failed to fetch userCollectionList from api: ' + error.message);
    } else if (!data) {
        return <div>No data is available</div>
    }


    const handleCollectionExpansionClick = (index: number) => {
        const newExpandedState = isExpanded.map((v, i) => {
            if (i == index) {
                return !v
            } else {
                return v
            }
        })
        setIsExpanded(newExpandedState)
        console.dir(isExpanded);
    }

    data.result.map((collectionObj, index) => {
        console.log(index);
    });

    return (
        <List>
            {data.result.map((collectionObj, index) => (
                <Box key={collectionObj.collection.canisterId}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
                        <ListItemText primary={collectionObj.collection.canisterId} />
                        <ListItemButton sx={{ maxWidth: '10%' }} onClick={() => handleCollectionExpansionClick(index)}>
                            {isExpanded[index] ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                    </Box>
                    <Collapse in={isExpanded[index]} timeout="auto" >
                        <Stack direction="row" sx={{ ml: 1, flexWrap: "wrap" }}>
                            {collectionObj.collection.tokens.map(token => (
                                <NftCard key={token.index.toString()} data={{
                                    imageUrl: token.smallImage,
                                    index: token.index.toString(),
                                    canisterId: collectionObj.collection.canisterId
                                }} />
                            ))}
                        </Stack>
                    </Collapse>
                </Box>
            ))}
        </List>
    )

}