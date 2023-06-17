import { useMutation, useQueryClient } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";
import { CreateStreetPostRequest } from "../../../backend_declarations/main_server/main_server.did";
import { NftInfo } from "../../components/Nft/nft";
import { useMainServer } from "../useMainServer";

export interface CreateStreetPostProps {
  userPid: string;
  nftInfo?: NftInfo;
  words: string;
  onSuccessCallback?: any;
}

const getCreatePostRequest = (
  createPostProps: CreateStreetPostProps
): CreateStreetPostRequest => {
  let request: CreateStreetPostRequest = {
    post_id: uuidv4(),
    created_by: createPostProps.userPid,
    created_ts: BigInt(Date.now()),
    words: createPostProps.words,
    nfts: [],
  };
  if (createPostProps.nftInfo) {
    request.nfts.push({
      canister_id: createPostProps.nftInfo.nftCanisterId,
      token_index: createPostProps.nftInfo.nftTokenIndex,
      token_id: createPostProps.nftInfo.nftTokenIdentifier,
      original_image_url: createPostProps.nftInfo.nftOriginalImageUrl,
      original_thumbnail_url: createPostProps.nftInfo.nftOriginalThumbnailUrl,
      collection_name: createPostProps.nftInfo.nftCollectionName,
    });
  }

  return request;
};

export function useCreateStreetPost(createPostProps: CreateStreetPostProps) {
  const mainServer = useMainServer();
  const queryClient = useQueryClient();

  const request = getCreatePostRequest(createPostProps);

  const mutation = useMutation(
    () => {
      return mainServer.create_street_post(request);
    },
    {
      onSuccess: () => {
        createPostProps.onSuccessCallback();
        queryClient.invalidateQueries(["streetPosts"]);
      },
    }
  );

  return mutation;
}
