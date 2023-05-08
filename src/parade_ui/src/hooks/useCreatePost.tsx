import { useCallback } from "react"
import { useMainServer } from "./useMainServer"
import { CreatePostRequest, CreatePostResponse, NftToken } from "../../backend_declarations/main_server/main_server.did"
import { useMutation } from 'react-query'

export interface CreatePostProps {
    userPid: string;
    nftCanisterId: string;
    nftTokenIndex: number;
    nftTokenIdentifier: string;
    words: string;
    isPublicPost: boolean;
}

const getCreatePostRequest = (createPostProps: CreatePostProps): CreatePostRequest => {
    const nft: NftToken = {
        canister_id: createPostProps.nftCanisterId,
        token_index: createPostProps.nftTokenIndex,
        token_id: createPostProps.nftTokenIdentifier,
    }
    return {
        created_by: createPostProps.userPid,
        created_ts: BigInt(Date.now()),
        words: createPostProps.words,
        in_public: createPostProps.isPublicPost,
        nfts: [nft],
        club_ids: [],
    }
}

export function useCreatePost(createPostProps: CreatePostProps) {
    const mainServer = useMainServer();
    const request = getCreatePostRequest(createPostProps);

    const mutation = useMutation(async () => {
        return await mainServer.create_post(request);
    }, {
        onSuccess: (data: CreatePostResponse) => {
            console.log(`createPost mutation success: ${data}`);
        },
        onError: (error: Error) => {
            console.log(`createPost mutation error: ${error}`);
        }
    });

    if (mutation.isError) {
        console.log(`createPost mutation error: ${mutation.error}`);
    }
    return mutation;
}