import { Box, TextField } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { styled } from "styled-components";
import { AppContext } from "../../App";
import { useClubPostDetail } from "../../hooks/fetch-posts/useClubPostDetail";
import { useStreetPostDetail } from "../../hooks/fetch-posts/useStreetPostDetail";
import { useReplyClubPost } from "../../hooks/react-to-post/useReplyClubPost";
import { useReplyStreetPost } from "../../hooks/react-to-post/useReplyStreetPost";
import { useGetUser } from "../../hooks/user/useGetUser";
import { MAX_REPLY_MESSAGE_LENGTH } from "../../utils/constants";
import { getTimeperiod } from "../../utils/getTimePeriod";
import { truncateStr } from "../../utils/strings";
import { NftImage } from "../Nft/NftImage";
import { UserAvatar } from "../Profile/Avatar";
import { Emojis } from "./Emojis";
import { PostReplies } from "./PostReplies";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 500px;
`;

const Header = styled.div`
  align-self: flex-start;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const TextEditor = styled.div`
  display: flex;
  align-items: center;
`;

const ReplyButton = styled.button`
  margin-left: 1rem;
  padding: 1rem;
  border-radius: 0.5rem;
  background-color: #f1efef;
`;

const ImageFooter = styled.div`
  display: flex;
  align-items: center;
  margin: 0.5rem 0;
  gap: 0.5rem;
`;

interface PostDetailProps {
  postId: string;
  clubId: string | undefined;
}

const PostDetail = ({ postId, clubId }: PostDetailProps) => {
  const appContext = useContext(AppContext);
  const streetQuery = useStreetPostDetail(postId, clubId === undefined);
  const clubQuery = useClubPostDetail(
    postId,
    clubId ?? "",
    clubId !== undefined
  );
  const query = clubId ? clubQuery : streetQuery;
  const userInfoQuery = useGetUser(query.data?.created_by ?? "");
  const [reply, setReply] = useState("");

  const streetMutation = useReplyStreetPost({
    postId: postId,
    words: reply,
    userPid: appContext.userLoginInfo.userPid,
  });
  const clubMutation = useReplyClubPost({
    postId: postId,
    words: reply,
    userPid: appContext.userLoginInfo.userPid,
    clubId: clubId ?? "",
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReply(event.target.value);
  };

  const handleReplySubmit = () => {
    clubId ? clubMutation.mutate() : streetMutation.mutate();
  };

  const isMutationLoading = () => {
    return clubId ? clubMutation.isLoading : streetMutation.isLoading;
  };

  if (query.isLoading) {
    return (
      <Box>
        <CircularProgress />
      </Box>
    );
  } else if (query.data === undefined) {
    return <h1>No post found</h1>;
  }

  const post = query.data;

  return (
    <Wrapper>
      <Header>
        <UserAvatar size={50} userId={post.created_by} />
        <h6>
          {truncateStr(
            userInfoQuery.data?.username ??
              userInfoQuery.data?.userId ??
              "unknow user",
            20
          )}
        </h6>
        <p>{getTimeperiod(post.created_ts)}</p>
      </Header>

      {post.nfts[0] && (
        <NftImage
          imageUrl={post.nfts[0].imageUrl}
          width={500}
          imageType={post.nfts[0].imageType}
          imageHeightWidthRatio={post.nfts[0].imageHeightWidthRatio}
        />
      )}
      {post.nfts[0] && (
        <ImageFooter>
          <p>{post.nfts[0].collectionName + ": #" + post.nfts[0].tokenIndex}</p>
          <button onClick={() => window.open(post.nfts[0].imageUrlOnChain)}>
            View on-chain
          </button>
        </ImageFooter>
      )}
      <p>{post.words}</p>
      <Emojis postId={postId} emojis={post.emoji_reactions} clubId={clubId} />
      <TextEditor>
        <TextField
          id="reply"
          placeholder="Show your reaction!"
          fullWidth
          multiline
          value={reply}
          onChange={handleInputChange}
          error={reply.length > MAX_REPLY_MESSAGE_LENGTH}
          helperText={
            reply.length > MAX_REPLY_MESSAGE_LENGTH ? "Max 500 characters" : ""
          }
        />
        {isMutationLoading() ? (
          <CircularProgress />
        ) : (
          <ReplyButton onClick={handleReplySubmit}>Reply</ReplyButton>
        )}
      </TextEditor>
      <PostReplies postId={postId} clubId={clubId} />
    </Wrapper>
  );
};

export const PostPage = () => {
  let { postId } = useParams();
  let { clubId } = useParams();

  return (
    <div style={{ marginTop: "5%", marginLeft: "25%" }}>
      <PostDetail postId={postId ?? "0"} clubId={clubId} />
    </div>
  );
};
