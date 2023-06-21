import { NftInfo } from "./nft";

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
