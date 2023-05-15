export const idlFactory = ({ IDL }) => {
  const NftToken = IDL.Record({
    'token_index' : IDL.Nat16,
    'token_id' : IDL.Text,
    'canister_id' : IDL.Text,
    'collection_name' : IDL.Text,
    'original_image_url' : IDL.Text,
    'original_thumbnail_url' : IDL.Text,
  });
  const CreatePostRequest = IDL.Record({
    'club_ids' : IDL.Opt(IDL.Vec(IDL.Text)),
    'nfts' : IDL.Vec(NftToken),
    'created_by' : IDL.Text,
    'created_ts' : IDL.Nat64,
    'words' : IDL.Text,
    'in_public' : IDL.Bool,
  });
  const Post = IDL.Record({
    'id' : IDL.Text,
    'club_ids' : IDL.Opt(IDL.Vec(IDL.Text)),
    'emoji_reactions' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat32)),
    'nfts' : IDL.Vec(NftToken),
    'created_by' : IDL.Text,
    'created_ts' : IDL.Nat64,
    'replies' : IDL.Vec(IDL.Text),
    'words' : IDL.Text,
    'in_public' : IDL.Bool,
  });
  const ServerError = IDL.Variant({
    'GetPostError' : IDL.Text,
    'ReactEmojiError' : IDL.Text,
    'CreatePostGeneralError' : IDL.Text,
    'ReplyPostError' : IDL.Text,
    'GetPostRepliesError' : IDL.Text,
    'DeletePostError' : IDL.Text,
  });
  const CreatePostResponse = IDL.Record({
    'post' : Post,
    'error' : IDL.Opt(ServerError),
  });
  const DeletePostResponse = IDL.Record({ 'error' : IDL.Opt(ServerError) });
  const GetPostByIdResponse = IDL.Record({
    'post' : IDL.Opt(Post),
    'error' : IDL.Opt(ServerError),
  });
  const GetPostRepliesRequest = IDL.Record({ 'post_id' : IDL.Text });
  const PostReply = IDL.Record({
    'id' : IDL.Text,
    'post_id' : IDL.Text,
    'emoji_reactions' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat32)),
    'nfts' : IDL.Vec(NftToken),
    'created_by' : IDL.Text,
    'created_ts' : IDL.Nat64,
    'words' : IDL.Text,
  });
  const GetPostRepliesResponse = IDL.Record({
    'error' : IDL.Opt(ServerError),
    'post_replies' : IDL.Vec(PostReply),
  });
  const GetPostByUserRequest = IDL.Record({ 'pid' : IDL.Text });
  const GetPostByUserResponse = IDL.Record({ 'posts' : IDL.Vec(Post) });
  const GetStreetPostsRequest = IDL.Record({
    'offset' : IDL.Int32,
    'limit' : IDL.Opt(IDL.Int32),
  });
  const GetStreetPostsResponse = IDL.Record({
    'offset' : IDL.Int32,
    'posts' : IDL.Vec(Post),
  });
  const ReactEmojiRequest = IDL.Record({
    'post_id' : IDL.Opt(IDL.Text),
    'reply_id' : IDL.Opt(IDL.Text),
    'user' : IDL.Text,
    'created_ts' : IDL.Nat64,
    'emoji' : IDL.Text,
  });
  const ReplyPostRequest = IDL.Record({
    'post_id' : IDL.Text,
    'nfts' : IDL.Vec(NftToken),
    'user' : IDL.Text,
    'created_ts' : IDL.Nat64,
    'words' : IDL.Text,
  });
  const ReplyPostResponse = IDL.Record({
    'error' : IDL.Opt(ServerError),
    'reply' : PostReply,
  });
  return IDL.Service({
    'create_post' : IDL.Func([CreatePostRequest], [CreatePostResponse], []),
    'delete_all_post' : IDL.Func([], [], []),
    'delete_post' : IDL.Func([IDL.Text], [DeletePostResponse], []),
    'get_post_by_id' : IDL.Func([IDL.Text], [GetPostByIdResponse], ['query']),
    'get_post_replies' : IDL.Func(
        [GetPostRepliesRequest],
        [GetPostRepliesResponse],
        ['query'],
      ),
    'get_posts_by_user' : IDL.Func(
        [GetPostByUserRequest],
        [GetPostByUserResponse],
        ['query'],
      ),
    'get_street_posts' : IDL.Func(
        [GetStreetPostsRequest],
        [GetStreetPostsResponse],
        ['query'],
      ),
    'react_emoji' : IDL.Func([ReactEmojiRequest], [DeletePostResponse], []),
    'reply_post' : IDL.Func([ReplyPostRequest], [ReplyPostResponse], []),
  });
};
export const init = ({ IDL }) => { return []; };
