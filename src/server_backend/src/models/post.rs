use super::api::CreatePostRequest;
use super::nft::NftToken;
use super::user::User;
use candid::{candid_method, CandidType, Decode, Encode, Principal};
use ic_stable_structures::{BoundedStorable, DefaultMemoryImpl, Log, StableBTreeMap, Storable};
use serde::Deserialize;
use std::collections::{BTreeMap, BTreeSet};

#[derive(Debug, Clone, CandidType, Deserialize)]
pub struct Post {
    pub id: PostIdString,   // {timestamp}-{user principal}-post
    pub created_by: String, // user principal
    pub nfts: Vec<NftToken>,
    pub in_public: bool, // whether this post is seenable in public street
    pub club_ids: Option<Vec<String>>, // whether this post is seenable in NFT clubs, if set, store club id list
    pub words: String,
    pub created_ts: u64,
    pub replies: Option<BTreeSet<String>>, // string is reply id with {timestamp}-{user principal}
    pub emoji_reactions: Option<BTreeMap<String, u32>>, // emoji reactions, key is emoji, value is count
}

#[derive(PartialEq, Eq, PartialOrd, Ord, Clone, CandidType, Deserialize, Debug)]
pub struct PostIdString(String);

impl PostIdString {
    pub fn new(request: &CreatePostRequest) -> Self {
        let id = request.created_ts.to_string() + "-" + &request.created_by + "-post";
        Self(id)
    }
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

// ######################
// Traits implementations for stable structures
// ######################
const MAX_POST_SIZE: u32 = 1000;
const MAX_POST_ID_STRING_KEY_SIZE: u32 = 100;

impl Storable for Post {
    fn to_bytes(&self) -> std::borrow::Cow<[u8]> {
        Encode!(self)
            .expect("failed to encode Post for stable storage")
            .into()
    }

    fn from_bytes(bytes: std::borrow::Cow<[u8]>) -> Self {
        Decode!(&bytes, Self).expect("failed to decode Post from stable storage")
    }
}

impl BoundedStorable for Post {
    const MAX_SIZE: u32 = MAX_POST_SIZE;
    const IS_FIXED_SIZE: bool = false;
}

impl Storable for PostIdString {
    fn to_bytes(&self) -> std::borrow::Cow<[u8]> {
        // String already implements `Storable`.
        self.0.to_bytes()
    }

    fn from_bytes(bytes: std::borrow::Cow<[u8]>) -> Self {
        Self(String::from_bytes(bytes))
    }
}

impl BoundedStorable for PostIdString {
    const MAX_SIZE: u32 = MAX_POST_ID_STRING_KEY_SIZE;
    const IS_FIXED_SIZE: bool = false;
}
