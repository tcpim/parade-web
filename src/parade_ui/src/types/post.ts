import { Post as ClubPost } from "../../backend_declarations/club_server/ludo_arts_club.did";
import { Post as StreetPost } from "../../backend_declarations/main_server/main_server.did";
import { NftInfo, converToNftInfo } from "./nft";

export interface Post {
  postId: string;
  created_by: string;
  created_ts: bigint;
  words: string;
  updated_ts: bigint;
  emoji_reactions: Array<[string, number]>;
  replies: Array<string>;
  nfts: Array<NftInfo>;
  clubId?: string;
  isPublic: boolean;
}

export interface PostsPage<T> {
  posts: Array<Post>;
  next_cursor: [T] | [];
}

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
