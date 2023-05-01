use candid::{candid_method, CandidType, Principal};
use ic_cdk::api::time;
use ic_cdk_macros::{query, update};
use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};
use ic_stable_structures::{BoundedStorable, DefaultMemoryImpl, Log, StableBTreeMap, Storable};
use models::*;
use serde::Deserialize;
use std::cell::RefCell;
use std::collections::{HashMap, HashSet, VecDeque};
use std::mem;

pub mod models;

type Memory = VirtualMemory<DefaultMemoryImpl>;

// ######################
// Stable Storage
// ######################
thread_local! {
    // initiate a memory manager
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> =
        RefCell::new(MemoryManager::init(DefaultMemoryImpl::default()));
}

// ######################
// APIs
// ######################

#[update]
#[candid_method(update)]
pub fn create_post(request: CreatePostRequest) -> u32 {
    17
}
