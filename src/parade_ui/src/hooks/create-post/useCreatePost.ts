import { useMutation, useQueryClient } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";
import { CreatePostRequest } from "../../../backend_declarations/club_server/ludo_arts_club.did";
import { CreateStreetPostRequest } from "../../../backend_declarations/main_server/main_server.did";
import { NftInfo } from "../../types/nft";
import { Post } from "../../types/post";
import { converToNftInfo } from "../../utils/helpers";
import { useClubServer } from "../useClubServer";
import { useMainServer } from "../useMainServer";
import { CreateClubPostProps } from "./useCreateClubPost";

export interface CreatePostProps {
  userPid: string;
  nftInfo?: NftInfo;
  words: string;
  clubInfo?: ClubPostInfo;
  onSuccessCallback?: any;
}

interface ClubPostInfo {
  clubId: string;
  isPublic: boolean;
}

const getCreatePostRequest = (
  createPostProps: CreatePostProps
): CreateStreetPostRequest | CreateClubPostProps => {
  if (createPostProps.clubInfo) {
    let request: CreatePostRequest = {
      post_id: uuidv4(),
      created_by: createPostProps.userPid,
      created_ts: BigInt(Date.now()),
      words: createPostProps.words,
      nfts: [],
      in_public: createPostProps.clubInfo?.isPublic,
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
  } else {
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
  }
};

export function useCreatePost(createPostProps: CreatePostProps) {
  const mainServer = useMainServer();
  const clubServer = useClubServer(createPostProps.clubInfo?.clubId ?? "");
  const queryClient = useQueryClient();

  const request = getCreatePostRequest(createPostProps);

  const createPost = (): Promise<Post> => {
    if (createPostProps.clubInfo) {
      return clubServer
        .create_post(request as CreatePostRequest)
        .then((res) => {
          const post: Post = {
            post_id: res.post.id,
            created_by: res.post.created_by,
            created_ts: res.post.created_ts,
            words: res.post.words,
            updated_ts: res.post.created_ts,
            emoji_reactions: [],
            replies: [],
            nfts: res.post.nfts.map((nft) => converToNftInfo(nft)),
            clubId: createPostProps.clubInfo?.clubId,
            isPublic: res.post.in_public,
          };
          return post;
        });
    } else {
      return mainServer
        .create_street_post(request as CreateStreetPostRequest)
        .then((res) => {
          const post: Post = {
            post_id: res.post.id,
            created_by: res.post.created_by,
            created_ts: res.post.created_ts,
            words: res.post.words,
            updated_ts: res.post.created_ts,
            emoji_reactions: [],
            replies: [],
            nfts: res.post.nfts.map((nft) => converToNftInfo(nft)),
            isPublic: true,
          };
          return post;
        });
    }
  };
  const mutation = useMutation(
    () => {
      return createPost();
    },
    {
      onSuccess: () => {
        createPostProps.onSuccessCallback();
        queryClient.invalidateQueries(["streetPosts"]);
        queryClient.invalidateQueries([
          "clubPosts",
          createPostProps.clubInfo?.clubId ?? "",
        ]);
      },
    }
  );

  return mutation;
}
