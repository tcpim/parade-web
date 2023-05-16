import { useCallback } from "react";
import { useMainServer } from "./useMainServer";
import {
  CreatePostRequest,
  CreatePostResponse,
  NftToken,
} from "../../backend_declarations/main_server/main_server.did";
import { useMutation } from "@tanstack/react-query";
import { NftInfo } from "../components/Nft/nft";

export interface CreatePostProps {
  userPid: string;
  nftInfo: NftInfo;
  words: string;
  isPublicPost: boolean;
}

const getCreatePostRequest = (
  createPostProps: CreatePostProps
): CreatePostRequest => {
  const nft: NftToken = {
    canister_id: createPostProps.nftInfo.nftCanisterId,
    token_index: createPostProps.nftInfo.nftTokenIndex,
    token_id: createPostProps.nftInfo.nftTokenIdentifier,
    original_image_url: createPostProps.nftInfo.nftOriginalImageUrl,
    original_thumbnail_url: createPostProps.nftInfo.nftOriginalThumbnailUrl,
    collection_name: createPostProps.nftInfo.nftCollectionName,
  };
  return {
    created_by: createPostProps.userPid,
    created_ts: BigInt(Date.now()),
    words: createPostProps.words,
    in_public: createPostProps.isPublicPost,
    nfts: [nft],
    club_ids: [],
  };
};

export function useCreatePost(createPostProps: CreatePostProps) {
  const mainServer = useMainServer();

  const mutation = useMutation(async () => {
    const request = getCreatePostRequest(createPostProps);
    return await mainServer.create_post(request);
  });

  return mutation;
}
