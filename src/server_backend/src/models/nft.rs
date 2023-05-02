use candid::CandidType;
use serde::Deserialize;

#[derive(Debug, Clone, CandidType, Deserialize)]
pub struct NftToken {
    pub canister_id: String,
    pub token_index: u16,
    pub token_id: String,
}
