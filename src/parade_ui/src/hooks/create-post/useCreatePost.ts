import { useMutation, useQueryClient } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";
import { CreatePostRequest } from "../../../backend_declarations/main_server/main_server.did";
import { NftInfo } from "../../components/Nft/nft";
import { useMainServer } from "../useMainServer";

export interface CreatePostProps {
  userPid: string;
  nftInfo?: NftInfo;
  words: string;
  isPublicPost: boolean;
  clubIds: string[]; // used by club tweets
  onSuccessCallback?: any;
}

const getCreatePostRequest = (
  createPostProps: CreatePostProps
): CreatePostRequest => {
  let request: CreatePostRequest = {
    post_id: uuidv4(),
    created_by: createPostProps.userPid,
    created_ts: BigInt(Date.now()),
    words: createPostProps.words,
    in_public: createPostProps.isPublicPost,
    nfts: [],
    club_ids:
      createPostProps.clubIds.length == 0 ? [] : [createPostProps.clubIds],
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

export function useCreatePost(createPostProps: CreatePostProps) {
  const mainServer = useMainServer();
  const queryClient = useQueryClient();

  const request = getCreatePostRequest(createPostProps);

  const mutation = useMutation(
    () => {
      return mainServer.create_post(request);
    },
    {
      onSuccess: () => {
        createPostProps.onSuccessCallback();
        if (createPostProps.clubIds.length > 0) {
          queryClient.invalidateQueries([
            "clubPosts",
            createPostProps.clubIds[0],
          ]);
        }

        if (createPostProps.isPublicPost) {
          queryClient.invalidateQueries(["streetPosts"]);
        }
      },
    }
  );

  return mutation;
}
