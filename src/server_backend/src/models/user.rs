use candid::{candid_method, CandidType, Decode, Encode, Principal};
use ic_stable_structures::{BoundedStorable, DefaultMemoryImpl, Log, StableBTreeMap, Storable};
use serde::Deserialize;

#[derive(Debug, Clone, CandidType, Deserialize)]
pub struct User {
    pub pid: String, // the user principal string formatxw
    pub user_name: String,
    pub avatar_url: String,
    pub bio: String,
}

#[derive(PartialEq, Eq, PartialOrd, Ord, Clone)]
pub struct UserPrincipalStringKey(String);

// ######################
// Traits implementations for stable structures
// ######################
const MAX_USER_SIZE: u32 = 200;
const MAX_USER_PRINCIPAL_STRING_KEY_SIZE: u32 = 100;

impl Storable for User {
    fn to_bytes(&self) -> std::borrow::Cow<[u8]> {
        Encode!(self)
            .expect("failed to encode User for stable storage")
            .into()
    }

    fn from_bytes(bytes: std::borrow::Cow<[u8]>) -> Self {
        Decode!(&bytes, Self).expect("failed to decode User from stable storage")
    }
}

impl BoundedStorable for User {
    const MAX_SIZE: u32 = MAX_USER_SIZE;
    const IS_FIXED_SIZE: bool = false;
}

impl Storable for UserPrincipalStringKey {
    fn to_bytes(&self) -> std::borrow::Cow<[u8]> {
        // String already implements `Storable`.
        self.0.to_bytes()
    }

    fn from_bytes(bytes: std::borrow::Cow<[u8]>) -> Self {
        Self(String::from_bytes(bytes))
    }
}

impl BoundedStorable for UserPrincipalStringKey {
    const MAX_SIZE: u32 = MAX_USER_PRINCIPAL_STRING_KEY_SIZE;
    const IS_FIXED_SIZE: bool = false;
}
