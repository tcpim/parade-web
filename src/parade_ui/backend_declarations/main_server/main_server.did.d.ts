import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface AddClubPostToStreetRequest {
  'post_id' : string,
  'nfts' : Array<NftToken>,
  'created_by' : string,
  'created_ts' : bigint,
  'caller' : string,
  'club_id' : string,
}
export interface AddClubPostToUserRequest {
  'user_post_created_key' : UserPostCreatedTsKey,
  'caller' : string,
}
export interface ClubPost { 'post_id' : string, 'club_id' : string }
export interface CollectionPostCreatedTsKey {
  'post_id' : string,
  'canister_id' : string,
  'created_ts' : bigint,
  'club_id' : [] | [string],
}
export interface CreateStreetPostRequest {
  'post_id' : string,
  'nfts' : Array<NftToken>,
  'created_by' : string,
  'created_ts' : bigint,
  'words' : string,
}
export interface CreateStreetPostResponse {
  'post' : Post,
  'error' : [] | [ServerError],
}
export interface GetCollectionPostsRequest {
  'cursor' : [] | [CollectionPostCreatedTsKey],
  'canister_id' : string,
  'limit' : [] | [number],
}
export interface GetCollectionPostsResponse {
  'error' : [] | [ServerError],
  'next_cursor' : [] | [CollectionPostCreatedTsKey],
  'posts' : Array<PostType>,
}
export interface GetPostByIdResponse { 'post' : [] | [Post] }
export interface GetPostRepliesRequest {
  'post_id' : string,
  'offset' : number,
  'limit' : [] | [number],
}
export interface GetPostRepliesResponse {
  'offset' : number,
  'error' : [] | [ServerError],
  'post_replies' : Array<PostReply>,
}
export interface GetStreetPostsRequest {
  'cursor' : [] | [PostCreatedTsKey],
  'limit' : [] | [number],
}
export interface GetStreetPostsResponse {
  'error' : [] | [ServerError],
  'next_cursor' : [] | [PostCreatedTsKey],
  'posts' : Array<PostType>,
}
export interface GetTrendingCollectionPostRequest {
  'cursor' : [] | [TrendingPostCollectionKey],
  'canister_id' : string,
  'limit' : [] | [number],
}
export interface GetTrendingCollectionPostResponse {
  'error' : [] | [ServerError],
  'next_cursor' : [] | [TrendingPostCollectionKey],
  'posts' : Array<PostType>,
}
export interface GetTrendingStreetPostRequest {
  'cursor' : [] | [TrendingPostKey],
  'limit' : [] | [number],
}
export interface GetTrendingStreetPostResponse {
  'error' : [] | [ServerError],
  'next_cursor' : [] | [TrendingPostKey],
  'posts' : Array<PostType>,
}
export interface GetUserInfoResponse { 'user' : [] | [User] }
export interface GetUserPostsRequest {
  'cursor' : [] | [UserPostCreatedTsKey],
  'user_id' : string,
  'limit' : [] | [number],
}
export interface GetUserPostsResponse {
  'error' : [] | [ServerError],
  'next_cursor' : [] | [UserPostCreatedTsKey],
  'posts' : Array<PostType>,
}
export interface NftToken {
  'token_index' : number,
  'token_id' : string,
  'image_url' : string,
  'image_thumbnail_url' : string,
  'canister_id' : string,
  'collection_name' : string,
}
export interface Post {
  'id' : string,
  'updated_ts' : bigint,
  'emoji_reactions' : Array<[string, number]>,
  'nfts' : Array<NftToken>,
  'created_by' : string,
  'created_ts' : bigint,
  'replies' : Array<string>,
  'words' : string,
}
export interface PostCreatedTsKey {
  'post_id' : string,
  'created_ts' : bigint,
  'club_id' : [] | [string],
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
export interface PostType {
  'post' : [] | [Post],
  'club_post' : [] | [ClubPost],
}
export interface ReactEmojiRequest {
  'post_id' : [] | [string],
  'reply_id' : [] | [string],
  'user' : string,
  'created_ts' : bigint,
  'emoji' : string,
}
export interface ReactEmojiResponse { 'error' : [] | [ServerError] }
export interface ReplyPostRequest {
  'post_id' : string,
  'reply_id' : string,
  'nfts' : Array<NftToken>,
  'user' : string,
  'created_ts' : bigint,
  'words' : string,
}
export interface ReplyPostResponse {
  'error' : [] | [ServerError],
  'reply' : PostReply,
}
export interface ServerError { 'error_message' : string, 'api_name' : string }
export interface SetUserAvatarRequest {
  'mime_type' : string,
  'user_id' : string,
  'avatar' : Uint8Array | number[],
}
export interface SetUserBioRequest { 'bio' : string, 'user_id' : string }
export interface SetUserInfoResponse {
  'user' : User,
  'error' : [] | [ServerError],
}
export interface SetUserNameRequest { 'user_id' : string, 'new_name' : string }
export interface TrendingPostCollectionKey {
  'trending_info' : TrendingPostKey,
  'canister_id' : string,
}
export interface TrendingPostKey {
  'updated_ts' : bigint,
  'post_id' : string,
  'created_ts' : bigint,
  'club_id' : [] | [string],
  'trending_score' : number,
}
export interface UpdateClubPostStreetTrendingScoreRequest {
  'new' : TrendingPostKey,
  'nft_canister_ids' : Array<string>,
  'caller' : string,
}
export interface User {
  'id' : string,
  'bio' : [] | [string],
  'user_name' : [] | [string],
  'avatar' : [] | [UserAvatar],
}
export interface UserAvatar {
  'data' : Uint8Array | number[],
  'mime_type' : string,
}
export interface UserPostCreatedTsKey {
  'post_id' : string,
  'created_ts' : bigint,
  'user_id' : string,
  'club_id' : [] | [string],
}
export interface _SERVICE {
  'add_club_post_to_street' : ActorMethod<
    [AddClubPostToStreetRequest],
    [] | [ServerError]
  >,
  'add_club_post_to_user' : ActorMethod<
    [AddClubPostToUserRequest],
    [] | [ServerError]
  >,
  'create_street_post' : ActorMethod<
    [CreateStreetPostRequest],
    CreateStreetPostResponse
  >,
  'create_user' : ActorMethod<[string], [] | [ServerError]>,
  'delete_all_users' : ActorMethod<[], [] | [ServerError]>,
  'delete_post' : ActorMethod<[string], [] | [ServerError]>,
  'dlp' : ActorMethod<[], [] | [ServerError]>,
  'get_post_replies' : ActorMethod<
    [GetPostRepliesRequest],
    GetPostRepliesResponse
  >,
  'get_posts_by_collection' : ActorMethod<
    [GetCollectionPostsRequest],
    GetCollectionPostsResponse
  >,
  'get_posts_by_user' : ActorMethod<
    [GetUserPostsRequest],
    GetUserPostsResponse
  >,
  'get_street_post_by_id' : ActorMethod<[string], GetPostByIdResponse>,
  'get_street_posts' : ActorMethod<
    [GetStreetPostsRequest],
    GetStreetPostsResponse
  >,
  'get_trending_collection_posts' : ActorMethod<
    [GetTrendingCollectionPostRequest],
    GetTrendingCollectionPostResponse
  >,
  'get_trending_street_posts' : ActorMethod<
    [GetTrendingStreetPostRequest],
    GetTrendingStreetPostResponse
  >,
  'get_user_info' : ActorMethod<[string], GetUserInfoResponse>,
  'react_emoji' : ActorMethod<[ReactEmojiRequest], ReactEmojiResponse>,
  'reply_post' : ActorMethod<[ReplyPostRequest], ReplyPostResponse>,
  'set_user_avatar' : ActorMethod<[SetUserAvatarRequest], SetUserInfoResponse>,
  'set_user_bio' : ActorMethod<[SetUserBioRequest], SetUserInfoResponse>,
  'set_user_name' : ActorMethod<[SetUserNameRequest], SetUserInfoResponse>,
  'update_club_post_trending_score' : ActorMethod<
    [UpdateClubPostStreetTrendingScoreRequest],
    undefined
  >,
}
