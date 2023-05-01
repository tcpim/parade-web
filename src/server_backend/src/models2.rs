use candid::{CandidType, Principal};
use serde::Deserialize;

// ######################
// Requests and responses
// ######################

// Create Post Update Method
#[derive(Debug, CandidType, Deserialize)]
pub struct CreatePostRequest {
    pub user: Principal,
    pub nfts: Vec<NftToken>,
    pub words: String,
}

#[derive(Debug, CandidType, Deserialize)]
pub struct GetPostsRequest {
    pub limit: Option<i32>,
    pub offset: u32,
}

// Get Posts Query Method
#[derive(Debug, CandidType, Deserialize)]
pub struct GetPostsResponse {
    pub offset: i32,
    pub posts: Vec<Post>,
}

// Get User Posts Query Method
#[derive(Debug, CandidType, Deserialize)]
pub struct GetUserPostsRequest {
    pub user: Principal,
}

#[derive(Debug, CandidType, Deserialize)]
pub struct GetUserPostsResponse {
    pub posts: Vec<Post>,
}

// Get Posts By NFT Canisters
#[derive(Debug, CandidType, Deserialize)]
pub struct GetPostsByNftCanistersRequest {
    pub nft_canisters: Vec<String>,
    pub limit: Option<i32>,
    pub offset: Option<u32>,
}

#[derive(Debug, CandidType, Deserialize)]
pub struct GetPostsByNftCanistersResponse {
    pub posts: Vec<Post>,
    pub offset: Option<u32>,
}

// Get Posts By IDs
#[derive(Debug, CandidType, Deserialize)]
pub struct GetPostsByIdsRequest {
    pub id: Vec<u32>,
}

#[derive(Debug, CandidType, Deserialize)]
pub struct GetPostsByIdsResponse {
    pub posts: Vec<Post>,
}

// Remove Posts By ID
#[derive(Debug, CandidType, Deserialize)]
pub struct RemovePostsByIdsRequest {
    pub id: Vec<u32>,
}

// ######################
// Helper structs
// ######################
#[derive(Clone, Debug, CandidType, Deserialize)]
pub enum NftTokenStandard {
    EXT,
}

#[derive(Clone, Debug, CandidType, Deserialize)]
pub enum ListingStatus {
    ACTIVE,
    WITHDRAWN(/* at: */ u64),
    FILLED(/* by: */ Principal, /* at: */ u64),
}

#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct ListingInfo {
    pub status: ListingStatus,
    pub listing_price: Option<u64>,
}

#[derive(Debug, Clone, CandidType, Deserialize)]
pub struct NftToken {
    pub canister_id: String,
    pub token_id: String,
    pub token_standard: NftTokenStandard,
    pub listing: Option<ListingInfo>,
    pub token_img_url: Option<String>,
}

#[derive(Debug, Clone, CandidType, Deserialize)]
pub struct Post {
    pub id: u32, // incremental ids
    pub user: Principal,
    pub nfts: Vec<NftToken>,
    pub words: String,
    pub created_ts: u64,
}
