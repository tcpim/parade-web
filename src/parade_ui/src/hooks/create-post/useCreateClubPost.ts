import { useMutation, useQueryClient } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";
import { CreatePostRequest } from "../../../backend_declarations/club_server/ludo_arts_club.did";
import { NftInfo } from "../../components/Nft/nft";
import { useClubServer } from "../useClubServer";

export interface CreateClubPostProps {
  clubId: string;
  userPid: string;
  nftInfo?: NftInfo;
  words: string;
  onSuccessCallback?: any;
  inPublic: boolean;
}

const getCreatePostRequest = (
  createClubPostProps: CreateClubPostProps
): CreatePostRequest => {
  let request: CreatePostRequest = {
    post_id: uuidv4(),
    created_by: createClubPostProps.userPid,
    created_ts: BigInt(Date.now()),
    words: createClubPostProps.words,
    nfts: [],
    in_public: createClubPostProps.inPublic,
  };
  if (createClubPostProps.nftInfo) {
    request.nfts.push({
      canister_id: createClubPostProps.nftInfo.nftCanisterId,
      token_index: createClubPostProps.nftInfo.nftTokenIndex,
      token_id: createClubPostProps.nftInfo.nftTokenIdentifier,
      original_image_url: createClubPostProps.nftInfo.nftOriginalImageUrl,
      original_thumbnail_url:
        createClubPostProps.nftInfo.nftOriginalThumbnailUrl,
      collection_name: createClubPostProps.nftInfo.nftCollectionName,
    });
  }

  return request;
};

export function useCreateClubPost(createPostProps: CreateClubPostProps) {
  const server = useClubServer(createPostProps.clubId);
  const queryClient = useQueryClient();

  const request = getCreatePostRequest(createPostProps);

  const mutation = useMutation(
    () => {
      return server.create_post(request);
    },
    {
      onSuccess: () => {
        createPostProps.onSuccessCallback();
        queryClient.invalidateQueries(["clubPosts", createPostProps.clubId]);
        if (createPostProps.inPublic) {
          queryClient.invalidateQueries(["streetPosts"]);
        }
      },
    }
  );

  return mutation;
}
