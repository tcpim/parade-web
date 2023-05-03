use candid::candid_method;
use ic_cdk_macros::{query, update};
use models::api::*;
use models::post::*;

mod models;
mod stable_structure;
mod tests;

// ######################
// APIs
// ######################

#[update]
#[candid_method(update)]
pub fn create_post(request: CreatePostRequest) -> CreatePostResponse {
    let post_id = PostIdString::new(&request);
    let post = Post {
        id: post_id.clone(),
        created_by: request.created_by,
        nfts: request.nfts,
        in_public: request.in_public,
        club_ids: request.club_ids,
        words: request.words,
        created_ts: request.created_ts,
        replies: None,
        emoji_reactions: None,
    };

    stable_structure::POST_BY_ID.with(|post_by_id| {
        let mut post_by_id = post_by_id.borrow_mut();
        post_by_id.insert(post_id.clone(), post.clone());
    });

    stable_structure::POSTS_STREET.with(|posts_street| {
        let posts_street = posts_street.borrow_mut();
        match posts_street.push(&post_id) {
            Ok(_) => {
                return CreatePostResponse {
                    post: post.clone(),
                    error: None,
                }
            }
            Err(_) => {
                return CreatePostResponse {
                    post: post.clone(),
                    error: Some(ServerError::CreatePostGeneralError(
                        "Failed to create a post".to_string(),
                    )),
                }
            }
        };
    })
}

#[query]
#[candid_method(query)]
pub fn get_street_posts(request: GetStreetPostsRequest) -> GetStreetPostsResponse {
    stable_structure::POSTS_STREET.with(|posts| {
        let posts = posts.borrow();

        // Normalize start and end
        let posts_len = posts.len() as i32;
        let mut start = request.offset;
        let mut end = start + request.limit.unwrap_or_else(|| 100);
        if start > posts_len {
            return GetStreetPostsResponse {
                posts: vec![],
                offset: posts_len,
            };
        }
        end = std::cmp::min(end, posts_len);

        // Iterate to get post ids from POSTS_STREET and then get each post from POST_BY_ID map
        let mut result_vec = vec![];
        for i in start..end {
            let post_id = posts.get(i as u64);
            match post_id {
                Some(post_id) => stable_structure::POST_BY_ID.with(|post_by_id| {
                    let post_by_id = post_by_id.borrow();
                    match post_by_id.get(&post_id) {
                        Some(post) => result_vec.push(post.clone()),
                        None => {
                            println!(
                                "Failed to find post in POST_BY_ID with post_id: {:?}",
                                &post_id
                            )
                        }
                    }
                }),
                None => {
                    println!("Failed to find post in POSTS_STREET with index : {:?}", i);
                    break;
                }
            }
        }

        return GetStreetPostsResponse {
            posts: result_vec,
            offset: end,
        };
    })
}

#[query]
#[candid_method(query)]
pub fn get_post_by_id(request: GetPostByIdRequest) -> GetPostByIdResponse {
    GetPostByIdResponse { post: None }
}

#[query]
#[candid_method(query)]
pub fn get_posts_by_user(request: GetPostByUserRequest) -> GetPostByUserResponse {
    GetPostByUserResponse { post: vec![] }
}

#[update]
#[candid_method(update)]
pub fn delete_post(request: DeletePostRequest) -> DeletePostResponse {
    DeletePostResponse { error: None }
}

#[update]
#[candid_method(update)]
pub fn delete_all_post() -> () {}

// ######################
// Below code is to generate candid file
// ######################
candid::export_service!();
fn export_candid() -> String {
    __export_service()
}
//
// #[cfg(test)]
// mod tests {
//     use super::*;
//     #[test]
//     fn write_candid_to_disk() {
//         std::fs::write("server_backend.did", export_candid()).unwrap();
//     }
// }
