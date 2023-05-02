use candid::candid_method;
use ic_cdk_macros::{query, update};
use models::api::*;
use models::post::*;
use stable_structure::*;

mod models;
mod stable_structure;

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
pub fn get_posts(request: GetPostsRequest) -> GetPostsResponse {
    stable_structure::POSTS_STREET.with(|posts| {
        let posts = posts.borrow();
        let mut post_vec = vec![];
        for post_id in posts.iter() {
            stable_structure::POST_BY_ID.with(|post_by_id| {
                let post_by_id = post_by_id.borrow();
                match post_by_id.get(&post_id) {
                    Some(post) => post_vec.push(post.clone()),
                    None => {}
                }
            })
        }
        return GetPostsResponse {
            posts: post_vec,
            offset: 0,
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

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn write_candid_to_disk() {
        std::fs::write("server_backend.did", export_candid()).unwrap();
    }
}
