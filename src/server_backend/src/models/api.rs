use super::nft::NftToken;
use super::post::Post;
use super::user::User;
use candid::CandidType;
use serde::Deserialize;
// ######################
// Requests and responses
// ######################

// Create a post
#[derive(Debug, CandidType, Deserialize)]
pub struct CreatePostRequest {
    pub created_by: String, // User's principal
    pub nfts: Vec<NftToken>,
    pub in_public: bool, // whether this post is seenable in public street
    pub club_ids: Option<Vec<String>>, // whether this post is seenable in NFT clubs, if set, store club id list
    pub words: String,
    pub created_ts: u64,
}

#[derive(Debug, CandidType, Deserialize)]
pub struct CreatePostResponse {
    pub post: Post,
    pub error: Option<ServerError>, // if set, there is error and post should be ignored
}

// Get all posts
#[derive(Debug, CandidType, Deserialize)]
pub struct GetStreetPostsRequest {
    pub limit: Option<i32>,
    pub offset: i32,
}

#[derive(Debug, CandidType, Deserialize)]
pub struct GetStreetPostsResponse {
    pub offset: i32,
    pub posts: Vec<Post>,
}

// Get a post by its ID
#[derive(Debug, CandidType, Deserialize)]
pub struct GetPostByIdRequest {
    pub id: String,
}

#[derive(Debug, CandidType, Deserialize)]
pub struct GetPostByIdResponse {
    pub post: Option<Post>,
}

// Get posts by user
#[derive(Debug, CandidType, Deserialize)]
pub struct GetPostByUserRequest {
    pub pid: String, // the user principal
}

#[derive(Debug, CandidType, Deserialize)]
pub struct GetPostByUserResponse {
    pub post: Vec<Post>,
}

// Remove a post
#[derive(Debug, CandidType, Deserialize)]
pub struct DeletePostRequest {
    pub id: String,
}

#[derive(Debug, CandidType, Deserialize)]
pub struct DeletePostResponse {
    pub error: Option<ServerError>,
}

// ######################
// Errors
// ######################

#[derive(Debug, CandidType, Deserialize)]
pub enum ServerError {
    CreatePostGeneralError(String),
    RemovePostError(String),
}
