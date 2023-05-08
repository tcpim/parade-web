import { useUserCollectionList } from '../../hooks/useUserCollectionList'
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
import { CollectionListData, Collection, Token } from '../../hooks/useUserCollectionList';
import { useCreatePost, CreatePostProps } from '../../hooks/useCreatePost';
import { PostCreationForm } from '../post/PostCreation';

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
            </CardContentNoPadding>
        </Card>
    )
}

interface CollectionListProps {
    userAccount: string;
}

interface PostFormNftData {
    collectionCanisterId: string;
    collectionName: string;
    tokenIndex: number;
    tokenIdentifier: string;
}

export const UserCollectionList = ({ userAccount }: CollectionListProps) => {
    const { data, isLoading, isError, error } = useUserCollectionList(userAccount);
    const [isExpanded, setIsExpanded] = useState<boolean[]>([]);
    const [openForm, setOpenForm] = useState<boolean>(false);
    const [postFormNftData, setPostFormNftData] = useState<PostFormNftData>({
        collectionCanisterId: "",
        collectionName: "",
        tokenIndex: 0,
        tokenIdentifier: "",
    });

    const handleOpenForm = (collection: Collection, token: Token) => {
        setOpenForm(true);
        setPostFormNftData({
            collectionCanisterId: collection.canisterId,
            collectionName: collection.collectionName,
            tokenIndex: token.index,
            tokenIdentifier: token.identifier,
        });
    };

    const handleCloseForm = () => {
        setOpenForm(false);
    };

    useEffect(() => {
        const collectionExpandedState: boolean[] = new Array(data?.collections.length).fill(true)
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

    if (data.collections.length == 0) {
        return <Box>You don't have any NFTs</Box>
    }
    return (
        <Box>
            <List>
                {data.collections.map((collection, index) => (
                    <Box key={collection.canisterId}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
                            <ListItemText primary={collection.collectionName + ": " + collection.canisterId} />
                            <ListItemButton sx={{ maxWidth: '10%' }} onClick={() => handleCollectionExpansionClick(index)}>
                                {isExpanded[index] ? <ExpandLess /> : <ExpandMore />}
                            </ListItemButton>
                        </Box>
                        <Collapse in={isExpanded[index]} timeout="auto" >
                            <Stack direction="row" sx={{ ml: 1, flexWrap: "wrap" }}>
                                {collection.tokens.map(token => (
                                    <Box>
                                        <NftCard key={token.index.toString()} data={{
                                            imageUrl: token.smallImage,
                                            index: token.index.toString(),
                                            canisterId: collection.canisterId
                                        }} />
                                        <Button size="small" color="primary" onClick={() => handleOpenForm(collection, token)}>
                                            <AddIcon />
                                        </Button>
                                    </Box>
                                ))}
                            </Stack>
                        </Collapse>
                    </Box>
                ))}
            </List>
            <PostCreationForm
                open={openForm}
                handleCloseForm={handleCloseForm}
                nftCanisterId={postFormNftData.collectionCanisterId}
                nftCollectionName={postFormNftData.collectionName}
                nftTokenIndex={postFormNftData.tokenIndex}
                nftTokenIdentifier={postFormNftData.tokenIdentifier} />
        </Box>

    )

}