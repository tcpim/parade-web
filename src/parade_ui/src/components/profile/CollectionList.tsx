import { useUserCollectionList } from '../../data/useUserCollectionList'

interface CollectionListProps {
    userAccount: string;
}


export const CollectionList = ({ userAccount }: CollectionListProps) => {
    const queryRes = useUserCollectionList(userAccount);

    if (queryRes.isLoading) {
        console.log("loading");
    } else {
        console.dir(queryRes.data);
    }
    return (
        <div>New componenet</div>
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