use candid::CandidType;
use candid::Principal;
use ic_cdk::api::time;
use ic_cdk_macros::{query, update};
use models::*;
use serde::Deserialize;
use std::cell::RefCell;
use std::collections::{HashMap, HashSet, VecDeque};
use std::mem;

pub mod models;

// ######################
// Storage
// ######################
thread_local! {
   // store post id in sequence of created time
   static POST_ID_STORE: RefCell<VecDeque<u32>> = RefCell::default();

   // main post storage by its ID
   static ID_TO_POST: RefCell<HashMap<u32, Post>> = RefCell::default();

   // auxiliary storage used for fast query
   static USER_TO_POST_LIST: RefCell<HashMap<Principal, VecDeque<u32>>> = RefCell::default();
   static NFT_CANISTER_ID_TO_POST_LIST: RefCell<HashMap<String, VecDeque<u32>>> = RefCell::default();
}
#[derive(CandidType, Deserialize, Default)]
struct StableState {
    post_id_store: VecDeque<u32>,
    id_to_post: HashMap<u32, Post>,
    user_to_post_list: HashMap<Principal, VecDeque<u32>>,
    nft_canister_id_post_list: HashMap<String, VecDeque<u32>>,
}

#[ic_cdk_macros::pre_upgrade]
fn pre_upgrade() {
    let post_id_store = POST_ID_STORE.with(|state| mem::take(&mut *state.borrow_mut()));
    let id_to_post = ID_TO_POST.with(|state| mem::take(&mut *state.borrow_mut()));
    let user_to_post_list = USER_TO_POST_LIST.with(|state| mem::take(&mut *state.borrow_mut()));
    let nft_canister_id_post_list =
        NFT_CANISTER_ID_TO_POST_LIST.with(|state| mem::take(&mut *state.borrow_mut()));

    let stable_state = StableState {
        post_id_store: post_id_store,
        id_to_post: id_to_post,
        user_to_post_list: user_to_post_list,
        nft_canister_id_post_list: nft_canister_id_post_list,
    };

    ic_cdk::storage::stable_save((stable_state,)).unwrap();
}

#[ic_cdk_macros::post_upgrade]
fn post_upgrade() {
    let (StableState {
        post_id_store,
        id_to_post,
        user_to_post_list,
        nft_canister_id_post_list,
    },) = ic_cdk::storage::stable_restore().unwrap();

    POST_ID_STORE.with(|state| *state.borrow_mut() = post_id_store);
    ID_TO_POST.with(|state| *state.borrow_mut() = id_to_post);
    USER_TO_POST_LIST.with(|state| *state.borrow_mut() = user_to_post_list);
    NFT_CANISTER_ID_TO_POST_LIST.with(|state| *state.borrow_mut() = nft_canister_id_post_list);
}

#[update]
// #[candid::candid_method(update)]
pub fn create_post(request: CreatePostRequest) -> u32 {
    let mut next_id = 0;

    // 1. Add to main post ID list
    POST_ID_STORE.with(|ids| {
        let mut ids_mut = ids.borrow_mut();
        next_id = ids_mut.len() as u32 + 1;
        ids_mut.push_front(next_id);
    });

    let ts = time();
    let post = Post {
        id: next_id,
        user: request.user,
        nfts: request.nfts,
        words: request.words,
        created_ts: ts,
    };

    // 2. Add to id to post map
    ID_TO_POST.with(|map| map.borrow_mut().insert(next_id, post.clone()));

    // 3. Add to user to post map
    USER_TO_POST_LIST.with(|map| {
        let mut map_mut = map.borrow_mut();
        match map_mut.get_mut(&request.user) {
            Some(ids) => {
                ids.push_front(next_id);
            }
            None => {
                let mut new_ids = VecDeque::new();
                new_ids.push_front(next_id);
                map_mut.insert(request.user.clone(), new_ids);
            }
        }
    });

    // 4. Add to NFT canister to post map
    NFT_CANISTER_ID_TO_POST_LIST.with(|state| {
        let mut nft_canister_post = state.borrow_mut();
        let mut visited = HashSet::<String>::new();

        for nft in post.nfts {
            // Dedup
            if visited.contains(&nft.canister_id) {
                continue;
            } else {
                visited.insert(String::from(&nft.canister_id));
            }

            match nft_canister_post.get_mut(&nft.canister_id) {
                Some(post_id) => {
                    post_id.push_front(post.id);
                }
                None => {
                    let mut new_ids = VecDeque::new();
                    new_ids.push_front(post.id);
                    nft_canister_post.insert(String::from(&nft.canister_id), new_ids);
                }
            }
        }
    });

    return next_id;
}

#[query]
/*
1. if request.offset = -1, get all pages
2. if out of bound, get all pages
 */
// #[candid::candid_method(query)]
pub fn get_posts(request: GetPostsRequest) -> GetPostsResponse {
    let mut page_res: Vec<Post> = Vec::new();
    let mut next_offset: i32 = 0;

    POST_ID_STORE.with(|post_id_store| {
        ID_TO_POST.with(|id_to_post| {
            let post_ids = post_id_store.borrow();
            let map = id_to_post.borrow();

            let start = request.offset;
            let end: u32;
            match request.limit {
                Some(limit) => {
                    // range out of bound, get all pages instead
                    if start + limit as u32 > post_ids.len() as u32 {
                        end = post_ids.len() as u32;
                        next_offset = -1;
                    } else {
                        end = start + limit as u32;
                        next_offset = end as i32;
                    }
                }
                None => {
                    // no limit means get all pages
                    end = post_ids.len() as u32;
                    next_offset = -1;
                }
            }

            for i in start..end {
                let opt_post_id = post_ids.get(i as usize);
                match opt_post_id {
                    Some(id) => match map.get(id) {
                        Some(post) => page_res.push(post.clone()),
                        None => (),
                    },
                    None => {
                        // should not happen here
                        next_offset = -1; // ran out of items, no more page
                        break;
                    }
                }
            }
        });
    });

    GetPostsResponse {
        posts: page_res,
        offset: next_offset,
    }
}

#[query]
// #[candid::candid_method(query)]
pub fn get_user_posts(request: GetUserPostsRequest) -> GetUserPostsResponse {
    let mut posts = Vec::new();

    USER_TO_POST_LIST.with(|user_post| {
        ID_TO_POST.with(|id_post| {
            let user_post_map = user_post.borrow();
            let id_post_map = id_post.borrow();

            match user_post_map.get(&request.user) {
                Some(p) => {
                    for id in p {
                        match id_post_map.get(id) {
                            Some(post) => posts.push(post.clone()),
                            None => (),
                        }
                    }
                }
                None => (),
            }
        })
    });

    GetUserPostsResponse { posts }
}

#[query]
// #[candid::candid_method(query)]
pub fn get_posts_by_nft_canisters(
    request: GetPostsByNftCanistersRequest,
) -> GetPostsByNftCanistersResponse {
    let mut aggregated_post_ids = Vec::<u32>::new();

    NFT_CANISTER_ID_TO_POST_LIST.with(|state| {
        let nft_post_map = state.borrow();
        for nft_canister in request.nft_canisters {
            match nft_post_map.get(&nft_canister) {
                Some(ids) => {
                    for (i, id) in ids.iter().enumerate() {
                        if i >= 50 {
                            // only get first 50 posts for each nft collection, otherwise too many result
                            break;
                        }

                        aggregated_post_ids.push(*id);
                    }
                }
                None => (), // no op if no post found for this nft collection
            }
        }
    });

    let mut aggregated_posts = Vec::<Post>::new();
    ID_TO_POST.with(|state| {
        let id_posts = state.borrow();

        for i in aggregated_post_ids {
            match id_posts.get(&i) {
                Some(p) => aggregated_posts.push(p.clone()),
                None => (),
            }
        }
    });

    aggregated_posts.sort_by(|a, b| b.created_ts.cmp(&a.created_ts));

    GetPostsByNftCanistersResponse {
        posts: aggregated_posts,
        offset: None,
    }
}

#[query]
// #[candid::candid_method(query)]
pub fn get_post_by_ids(request: GetPostsByIdsRequest) -> GetPostsByIdsResponse {
    let mut result = Vec::<Post>::new();

    ID_TO_POST.with(|state| {
        let id_post_map = state.borrow();

        for id in request.id {
            match id_post_map.get(&id) {
                Some(p) => result.push(p.clone()),
                None => (),
            }
        }
    });

    GetPostsByIdsResponse { posts: result }
}

#[update]
/*
currently only remove the id to post pair in ID_TO_POST
other storate map still contain the pair of x -> ID, but the queries should not include those result anymore
however, we should clean up the unused IDs in a heartbeat method
*/
// #[candid::candid_method(update)]
pub fn remove_post_by_ids(request: RemovePostsByIdsRequest) {
    ID_TO_POST.with(|state| {
        let mut id_post_map = state.borrow_mut();
        for id in request.id {
            if id_post_map.contains_key(&id) {
                id_post_map.remove(&id);
            }
        }
    });
}

#[update]
/**
 * Clean up all posts storage
 */
// #[candid::candid_method(update)]
pub fn remove_all_posts() {
    POST_ID_STORE.with(|state| {
        state.borrow_mut().clear();
    });

    ID_TO_POST.with(|state| {
        state.borrow_mut().clear();
    });

    USER_TO_POST_LIST.with(|state| {
        state.borrow_mut().clear();
    });

    NFT_CANISTER_ID_TO_POST_LIST.with(|state| {
        state.borrow_mut().clear();
    });
}

/*
1. add #[candid::candid_method(query)]
2. comment out .cargo/config.toml file, otherwise won't run
 */
pub fn generate_candid() {
    candid::export_service!();
    std::print!("{}", __export_service());
}
