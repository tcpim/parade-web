import { Principal } from '@dfinity/principal';
import { getAllUserNFTs, getNFTInfo, getNFTActor } from '@psychedelic/dab-js';
import { HttpAgent } from '@dfinity/agent';
import { useState, useEffect } from "react";
import PostNftForm from './PostNftForm'

export const NftRow = (props) => {
    // const collectionArray = props.collectionArray;
    // const collectionRecords = collectionArray.map(getNftRow);
    const token = props.token;
    const collection = props.collection;
    const [transferTo, setTransferTo] = useState("");
    const [postDialogOpen, setPostDialogOpen] = useState(false);

    const getNftImage = (token) => {
        return (
            <img
                src={token.url}
                alt="new"
                height="400"
                width="400"
            />
        );
    };

    const handleTransfer = (event, collectionStandard, collectionCanister, tokenIndex) => {
        //window.alert(collectionCanister + ":" + tokenIndex);
        const plugAgent = window.ic.plug.agent;
        const NFTActor = getNFTActor(
            {
                canisterId: collectionCanister,
                agent: plugAgent,
                standard: collectionStandard
            }
        );

        NFTActor.transfer(Principal.fromText(transferTo), tokenIndex).then(() => window.alert("Transfer succeeded"));
        event.preventDefault();
    };

    const getSendForm = () => {
        return (
            <form onSubmit={(event) => handleTransfer(event, collection.standard, token.canister, Number(token.index))}>
                <label>
                    Send to principal:
                    <input type="text" value={transferTo} onChange={(event) => setTransferTo(event.target.value)} />
                </label>
                <input type="submit" value="Send" />
            </form>
        );
    };

    const handlePostClick = () => {
        setPostDialogOpen(true);
    };

    const handlePostDialogClose = () => {
        setPostDialogOpen(false);
    };

    return (
        <li>
            <div>ID: {token.id}</div>
            <div>{getNftImage(token)}</div>
            <div>{getSendForm()}</div>
            <PostNftForm collection={collection} token={token} />
        </li>
    );
}