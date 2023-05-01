use candid::{CandidType, Principal};
use serde::Deserialize;
use std::collections::{BTreeMap, BTreeSet};

// ######################
// Requests and responses
// ######################

#[derive(Debug, CandidType, Deserialize)]
pub struct CreatePostRequest {
    pub created_by: User,
    pub nfts: Vec<NftToken>,
    pub in_public: bool, // whether this post is seenable in public street
    pub in_club: bool,   // whether this post is seenable in NFT club
    pub words: String,
    pub created_ts: u64,
}

#[derive(Debug, CandidType, Deserialize)]
pub struct CreatePostResponse {
    pub post: Post,
    pub error: Option<ServerError>, // if set, there is error and post should be ignored
}

#[derive(Debug, CandidType, Deserialize)]
pub struct GetPostsRequest {
    pub limit: Option<i32>,
    pub offset: u32,
    pub from_club_id: Option<String>, // if set, only return posts from this club
}

#[derive(Debug, CandidType, Deserialize)]
pub struct GetPostsResponse {
    pub offset: i32,
    pub posts: Vec<Post>,
}

// ######################
// Errors
// ######################

#[derive(Debug, CandidType, Deserialize)]
pub enum ServerError {
    CreatePostGeneralError(String),
}

// ######################
// Objects
// ######################
#[derive(Clone, Debug, CandidType, Deserialize)]
pub enum NftTokenStandard {
    EXT,
}

#[derive(Debug, Clone, CandidType, Deserialize)]
pub struct NftToken {
    pub canister_id: String,
    pub collection_name: String,
    pub nft_club_id: String,
    pub token_index: u16,
    pub token_id: String,
    pub token_standard: NftTokenStandard,
    pub token_original_img_url: String,
    pub token_original_img_url_thumbnail: Option<String>,
    pub token_cached_img_url: Option<String>,
}

#[derive(Debug, Clone, CandidType, Deserialize)]
pub struct Post {
    pub id: String,       // {timestamp}-{user principal}-post
    pub created_by: User, // user principal
    pub nfts: Vec<NftToken>,
    pub in_public: bool, // whether this post is seenable in public street
    pub in_club: bool,   // whether this post is seenable in NFT club
    pub words: String,
    pub created_ts: u64,
    pub replies: BTreeSet<String>, // string is reply id with {timestamp}-{user principal}
    pub emoji_reactions: BTreeMap<String, u32>, // emoji reactions, key is emoji, value is count
}

#[derive(Debug, Clone, CandidType, Deserialize)]
pub struct User {
    pub pid: Principal,
    pub user_name: String,
    pub avatar_url: String,
    pub bio: String,
}

#[derive(Debug, Clone, CandidType, Deserialize)]
pub struct PostReply {
    pub id: String,          // the reply id, {timestamp}-{user principal}-reply
    pub user: User,          // user who replied
    pub post_id: String,     // the post being replied. See Post.id
    pub content: String,     // the reply content
    pub created_ts: u64,     // the timestamp when this reply is created
    pub nfts: Vec<NftToken>, // user can reply with NFTs
    pub emoji_reactions: BTreeMap<String, u32>, // emoji reactions, key is emoji, value is count
}
