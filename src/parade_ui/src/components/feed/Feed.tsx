import { useState, useEffect } from "react";
// import { server_backend } from "../../../../declarations/server_backend";
// import { GetPostsRequest, GetPostsResponse, Post } from "../../../../declarations/server_backend/server_backend.did";


export const Feed = () => {
    // const [getPostsResponse, setGetPostsResponse] = useState<GetPostsResponse>();

    // useEffect(() => {
    //     const fetchData = async () => {
    //         const request: GetPostsRequest = {
    //             'offset': 0,
    //             'limit': [],
    //         };
    //         const response: GetPostsResponse = await server_backend.get_posts(request);
    //         setGetPostsResponse(response);
    //     };

    //     fetchData().catch(console.error);
    // }, []);

    // const getPostFeed = () => {
    //     console.dir(getPostsResponse);
    //     if (!getPostsResponse) {
    //         return <h1>Loading...</h1>;
    //     }

    //     return <ul>{getPostsResponse.posts.map((post) => getPostItem(post))}</ul>;
    // };

    // const getPostItem = (post: Post) => {
    //     console.log(post);
    //     console.log(post.id);
    //     console.log(post.user.toString());
    //     console.log(post.created_ts);

    //     const nft = post.nfts[0];
    //     return (
    //         <li>
    //             <p>User {post.user.toString()}</p>
    //             <p><b>{post.words}</b></p>
    //             <p>NFT canister ID: {nft ? nft.canister_id : "no nft"}</p>
    //             <p>NFT token ID: {nft ? nft.token_id.toString() : "no nft"}</p>
    //             {/* <p>NFT token standard: {nft ? nft.token_standard : "no nft"}</p> */}
    //             {/* <div>
    //       <img
    //         src={post.url}
    //         alt="new"
    //         height="300"
    //         width="300"
    //       />
    //     </div> */}
    //         </li>
    //     );
    // };

    return (
        <div>
            <h1>Let's see what is going on...</h1>

            {/* <ul>{getPostFeed()}</ul> */}
        </div>
    );
}