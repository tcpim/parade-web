import {
  NftToken as ClubNftToken,
  Post as ClubPost,
} from "../../backend_declarations/club_server/ludo_arts_club.did";
import {
  NftToken as StreetNftToken,
  Post as StreetPost,
} from "../../backend_declarations/main_server/main_server.did";
import { NftInfo } from "../types/nft";
import { Post } from "../types/post";

export const converToNftInfo = (
  nft: StreetNftToken | ClubNftToken
): NftInfo => {
  return {
    nftCanisterId: nft.canister_id,
    nftTokenIndex: nft.token_index,
    nftTokenIdentifier: nft.token_id,
    nftOriginalImageUrl: nft.original_image_url,
    nftOriginalThumbnailUrl: nft.original_thumbnail_url,
    nftCollectionName: nft.collection_name,
  };
};

export const convertToPost = (
  post?: ClubPost | StreetPost
): Post | undefined => {
  if (!post) {
    return undefined;
  }
  const postType = (post as ClubPost).club_id !== undefined ? "club" : "street";

  return {
    postId: post.id,
    clubId: postType === "club" ? (post as ClubPost).club_id : undefined,
    created_by: post.created_by,
    created_ts: post.created_ts,
    words: post.words,
    updated_ts: post.updated_ts,
    emoji_reactions: post.emoji_reactions,
    replies: post.replies,
    nfts: post.nfts.map(converToNftInfo),
    isPublic: postType === "street" ? true : (post as ClubPost).in_public,
  };
};
