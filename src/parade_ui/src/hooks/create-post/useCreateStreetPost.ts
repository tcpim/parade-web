import { useMutation, useQueryClient } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";
import { CreateStreetPostRequest } from "../../../backend_declarations/main_server/main_server.did";
import { NftInfo } from "../../types/nft";
import { Post, convertToPost } from "../../types/post";
import { useMainServerActorUpdate } from "../server-connect/useMainServerActor";

export interface CreateStreetPostProps {
  userPid: string;
  nftInfo?: NftInfo;
  words: string;
  onSuccessCallback?: any;
}

const getCreatePostRequest = (
  props: CreateStreetPostProps
): CreateStreetPostRequest => {
  let request: CreateStreetPostRequest = {
    post_id: uuidv4(),
    created_by: props.userPid,
    created_ts: BigInt(Date.now()),
    words: props.words,
    nfts: [],
  };
  if (props.nftInfo) {
    request.nfts.push({
      canister_id: props.nftInfo.canisterId,
      token_index: props.nftInfo.tokenIndex,
      token_id: props.nftInfo.tokenIdentifier,
      image_url: props.nftInfo.imageUrl,
      image_thumbnail_url: props.nftInfo.imageThumbnailUrl,
      collection_name: props.nftInfo.collectionName,
    });
  }

  return request;
};

export function useCreateStreetPost(createPostProps: CreateStreetPostProps) {
  const queryClient = useQueryClient();
  const actor = useMainServerActorUpdate();
  const request = getCreatePostRequest(createPostProps);

  const mutation = useMutation(
    async () => {
      const response = await actor.create_street_post(request);
      if (response.error[0] != undefined) {
        throw new Error(
          "Error create_street_post: " + response.error[0].error_message
        );
      }
      const result: Post | undefined = convertToPost(response.post);
      return result;
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
