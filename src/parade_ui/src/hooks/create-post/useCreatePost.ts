import { useCallback } from "react";
import { useMainServer } from "../useMainServer";
import {
  CreatePostRequest,
  CreatePostResponse,
  NftToken,
} from "../../../backend_declarations/main_server/main_server.did";
import { useMutation } from "@tanstack/react-query";
import { NftInfo } from "../../components/Nft/nft";
import { v4 as uuidv4 } from "uuid";

export interface CreatePostProps {
  userPid: string;
  nftInfo: NftInfo;
  words: string;
  isPublicPost: boolean;
  clubIds: string[];
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
    post_id: uuidv4(),
    created_by: createPostProps.userPid,
    created_ts: BigInt(Date.now()),
    words: createPostProps.words,
    in_public: createPostProps.isPublicPost,
    nfts: [nft],
    club_ids:
      createPostProps.clubIds.length == 0 ? [] : [createPostProps.clubIds],
  };
};

export function useCreatePost(createPostProps: CreatePostProps) {
  const mainServer = useMainServer();

  const mutation = useMutation(() => {
    const request = getCreatePostRequest(createPostProps);
    return mainServer.create_post(request);
  });

  return mutation;
}
