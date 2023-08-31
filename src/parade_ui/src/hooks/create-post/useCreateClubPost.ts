import { useMutation, useQueryClient } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";
import { CreatePostRequest } from "../../../backend_declarations/club_server/ludo_arts_club.did";
import { NftInfo } from "../../types/nft";
import { Post, convertToPost } from "../../types/post";
import { useClubServerActor } from "../server-connect/useClubServerActor";

export interface CreateClubPostProps {
  clubId: string;
  userPid: string;
  nftInfo?: NftInfo;
  words: string;
  onSuccessCallback?: any;
  inPublic: boolean;
}

const getCreatePostRequest = (
  props: CreateClubPostProps
): CreatePostRequest => {
  let request: CreatePostRequest = {
    post_id: uuidv4(),
    created_by: props.userPid,
    created_ts: BigInt(Date.now()),
    words: props.words,
    nfts: [],
    in_public: props.inPublic,
  };
  if (props.nftInfo) {
    request.nfts.push({
      canister_id: props.nftInfo.canisterId,
      token_index: props.nftInfo.tokenIndex,
      token_id: props.nftInfo.tokenIdentifier,
      image_url: props.nftInfo.imageUrl,
      image_thumbnail_url: props.nftInfo.imageThumbnailUrl,
      collection_name: props.nftInfo.collectionName,
      image_type: props.nftInfo.imageType ?? "",
      image_height_width_ratio:
        props.nftInfo.imageHeightWidthRatio?.toString() ?? "",
      image_onchain_url: props.nftInfo.imageUrl,
      club_id: props.clubId,
    });
  }

  return request;
};

export function useCreateClubPost(createPostProps: CreateClubPostProps) {
  const queryClient = useQueryClient();
  const clubServer = useClubServerActor(createPostProps.clubId);
  const request = getCreatePostRequest(createPostProps);

  const mutation = useMutation(
    async () => {
      if (createPostProps.clubId === "") {
        throw new Error("clubId is empty");
      }

      const response = await clubServer.create_post(request);
      const result: Post | undefined = convertToPost(response.post);
      if (response.error[0] != undefined) {
        throw new Error(
          "Error club create_post: " + response.error[0].error_message
        );
      }

      return result;
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
