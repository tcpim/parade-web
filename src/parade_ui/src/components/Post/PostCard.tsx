import { Divider } from "@mui/material";
import { memo } from "react";
import { BsChatLeft } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import { useGetUser } from "../../hooks/user/useGetUser";
import { Post } from "../../types/post";
import { getTimeperiod } from "../../utils/getTimePeriod";
import { getUserName } from "../../utils/getUsername";
import { NftImage } from "../Nft/NftImage";
import { UserAvatar } from "../Profile/Avatar";
import { Emojis } from "./Emojis";

const Wrapper = styled.div`
  margin-bottom: 1rem;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const StyledWords = styled.div`
  display: flex;
  align-items: baseline;
  gap: 1rem;
`;

const ReplyButton = styled.button`
  border: none;
  background-color: #eeeded;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 5rem;
  height: 3rem;
  margin-bottom: 1rem;

  &:hover {
    cursor: pointer;
    background-color: gray;
  }
`;

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  const navigate = useNavigate();
  const userInfoQuery = useGetUser(post.created_by);

  const handlePostClick = () => {
    if (post.clubId) {
      navigate("/club/" + post.clubId + "/post/" + post.postId);
    } else {
      navigate("/post/" + post.postId);
    }
  };

  return (
    <Wrapper>
      <Header>
        <UserAvatar size={50} userId={post.created_by} />
        <h6>{userInfoQuery.data?.username ?? userInfoQuery.data?.userId}</h6>
        <p>{getTimeperiod(post.created_ts)}</p>
      </Header>
      {post.nfts[0] && (
        <p>{post.nfts[0].collectionName + ": #" + post.nfts[0].tokenIndex}</p>
      )}
      {post.nfts[0] && (
        <NftImage
          imageUrl={post.nfts[0].imageUrl}
          width={500}
          imageType={post.nfts[0].imageType}
          imageHeightWidthRatio={post.nfts[0].imageHeightWidthRatio}
        />
      )}
      <StyledWords>
        <h6>{getUserName(userInfoQuery.data)}</h6>
        <p>{post.words}</p>
      </StyledWords>
      <Emojis
        postId={post.postId}
        emojis={post.emoji_reactions}
        clubId={post.clubId}
      />
      <ReplyButton onClick={handlePostClick}>
        <BsChatLeft />
        <span>{post.replies.length}</span>
      </ReplyButton>
      <Divider orientation="horizontal" />
    </Wrapper>
  );
};

export const PostCardMemo = memo(PostCard);
