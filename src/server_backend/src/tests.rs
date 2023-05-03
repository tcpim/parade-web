#[cfg(test)]
mod tests {
    use crate::create_post;
    use crate::export_candid;
    use crate::get_street_posts;
    use crate::models::api::{CreatePostRequest, GetStreetPostsRequest};

    #[test]
    fn write_candid_to_disk() {
        std::fs::write("server_backend.did", export_candid()).unwrap();
    }

    #[test]
    fn create_and_get_posts_with_pagination() {
        let create_post_request_1 =
            generate_create_post_request("hi_1".to_string(), "tim".to_string());
        let create_post_request_2 =
            generate_create_post_request("hi_2".to_string(), "peter".to_string());
        let create_post_request_3 =
            generate_create_post_request("hi_3".to_string(), "ryan".to_string());

        create_post(create_post_request_1);
        create_post(create_post_request_2);
        create_post(create_post_request_3);

        let get_street_posts_request = GetStreetPostsRequest {
            limit: Option::Some(4),
            offset: 3,
        };
        let get_street_posts_response = get_street_posts(get_street_posts_request);

        assert_eq!(get_street_posts_response.posts.len(), 0);
        for post in get_street_posts_response.posts {
            println!("{:?}", post)
        }
    }

    // Helper methods for generating requests
    fn generate_create_post_request(words: String, created_by: String) -> CreatePostRequest {
        CreatePostRequest {
            created_by,
            nfts: vec![],
            in_public: true,
            club_ids: None,
            words,
            created_ts: 0,
        }
    }
}
