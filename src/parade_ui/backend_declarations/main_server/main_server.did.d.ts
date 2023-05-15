import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface CreatePostRequest {
  'club_ids' : [] | [Array<string>],
  'nfts' : Array<NftToken>,
  'created_by' : string,
  'created_ts' : bigint,
  'words' : string,
  'in_public' : boolean,
}
export interface CreatePostResponse {
  'post' : Post,
  'error' : [] | [ServerError],
}
export interface DeletePostResponse { 'error' : [] | [ServerError] }
export interface GetPostByIdResponse {
  'post' : [] | [Post],
  'error' : [] | [ServerError],
}
export interface GetPostByUserRequest { 'pid' : string }
export interface GetPostByUserResponse { 'posts' : Array<Post> }
export interface GetPostRepliesRequest { 'post_id' : string }
export interface GetPostRepliesResponse {
  'error' : [] | [ServerError],
  'post_replies' : Array<PostReply>,
}
export interface GetStreetPostsRequest {
  'offset' : number,
  'limit' : [] | [number],
}
export interface GetStreetPostsResponse {
  'offset' : number,
  'posts' : Array<Post>,
}
export interface NftToken {
  'token_index' : number,
  'token_id' : string,
  'canister_id' : string,
  'collection_name' : string,
  'original_image_url' : string,
  'original_thumbnail_url' : string,
}
export interface Post {
  'id' : string,
  'club_ids' : [] | [Array<string>],
  'emoji_reactions' : Array<[string, number]>,
  'nfts' : Array<NftToken>,
  'created_by' : string,
  'created_ts' : bigint,
  'replies' : Array<string>,
  'words' : string,
  'in_public' : boolean,
}
export interface PostReply {
  'id' : string,
  'post_id' : string,
  'emoji_reactions' : Array<[string, number]>,
  'nfts' : Array<NftToken>,
  'created_by' : string,
  'created_ts' : bigint,
  'words' : string,
}
export interface ReactEmojiRequest {
  'post_id' : [] | [string],
  'reply_id' : [] | [string],
  'user' : string,
  'created_ts' : bigint,
  'emoji' : string,
}
export interface ReplyPostRequest {
  'post_id' : string,
  'nfts' : Array<NftToken>,
  'user' : string,
  'created_ts' : bigint,
  'words' : string,
}
export interface ReplyPostResponse {
  'error' : [] | [ServerError],
  'reply' : PostReply,
}
export type ServerError = { 'GetPostError' : string } |
  { 'ReactEmojiError' : string } |
  { 'CreatePostGeneralError' : string } |
  { 'ReplyPostError' : string } |
  { 'GetPostRepliesError' : string } |
  { 'DeletePostError' : string };
export interface _SERVICE {
  'create_post' : ActorMethod<[CreatePostRequest], CreatePostResponse>,
  'delete_all_post' : ActorMethod<[], undefined>,
  'delete_post' : ActorMethod<[string], DeletePostResponse>,
  'get_post_by_id' : ActorMethod<[string], GetPostByIdResponse>,
  'get_post_replies' : ActorMethod<
    [GetPostRepliesRequest],
    GetPostRepliesResponse
  >,
  'get_posts_by_user' : ActorMethod<
    [GetPostByUserRequest],
    GetPostByUserResponse
  >,
  'get_street_posts' : ActorMethod<
    [GetStreetPostsRequest],
    GetStreetPostsResponse
  >,
  'react_emoji' : ActorMethod<[ReactEmojiRequest], DeletePostResponse>,
  'reply_post' : ActorMethod<[ReplyPostRequest], ReplyPostResponse>,
}
