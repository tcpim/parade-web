use super::models::post::{Post, PostIdString};
use super::models::user::{User, UserPrincipalStringKey};
use candid::{candid_method, CandidType, Decode, Encode, Principal};
use ic_cdk_macros::{query, update};
use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};
use ic_stable_structures::{
    BoundedStorable, DefaultMemoryImpl, Log, StableBTreeMap, StableVec, Storable,
};
use std::cell::RefCell;

type Memory = VirtualMemory<DefaultMemoryImpl>;
const USER_BY_ID_MEMORY_ID: MemoryId = MemoryId::new(0);
const POST_BY_ID_MEMORY_ID: MemoryId = MemoryId::new(1);
const POSTS_STREET_MEMORY_ID: MemoryId = MemoryId::new(2);

thread_local! {
// initiate a memory manager
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> =
        RefCell::new(MemoryManager::init(DefaultMemoryImpl::default()));

    // Key value store for objects. Key is usually the object id
    pub static USER_BY_ID: RefCell<StableBTreeMap<UserPrincipalStringKey, User, Memory>> =
        MEMORY_MANAGER.with(|memory_manager|
            RefCell::new(
                StableBTreeMap::init(
                    memory_manager.borrow().get(USER_BY_ID_MEMORY_ID)
                )
            )
        );

    pub static POST_BY_ID: RefCell<StableBTreeMap<PostIdString, Post, Memory>> =
        MEMORY_MANAGER.with(|memory_manager|
            RefCell::new(
                StableBTreeMap::init(
                    memory_manager.borrow().get(POST_BY_ID_MEMORY_ID)
                )
            )
        );

    // Database
    pub static POSTS_STREET: RefCell<StableVec<PostIdString, Memory>> =
        MEMORY_MANAGER.with(|memory_manager|
            RefCell::new(
                StableVec::init(
                    memory_manager.borrow().get(POSTS_STREET_MEMORY_ID)
                )
                .expect("Expected to initialize the POSTS_STREET without error")
            )
        );
}
