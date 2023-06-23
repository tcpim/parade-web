import { ChatBubbleOutline } from "@mui/icons-material";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  IconButton,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useGetUser } from "../../hooks/user/useGetUser";
import { Post } from "../../types/post";
import { getTimeperiod } from "../../utils/getTimePeriod";
import { NftImage } from "../Nft/NftImage";
import { UserAvatar } from "../Profile/Avatar";
import { Emojis } from "./Emojis";

interface PostCardProps {
  post: Post;
}
export const PostCard = ({ post }: PostCardProps) => {
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
    <Card sx={{ marginBottom: 10 }}>
      <CardContent>
        <Box display="flex">
          <UserAvatar size={50} />
          <Typography variant="h6" component="span" marginLeft="10px">
            {userInfoQuery.data?.username}
          </Typography>
        </Box>
        <Typography color="text.secondary">
          {getTimeperiod(post.created_ts)}
        </Typography>
        {post.nfts[0] && (
          <Typography variant="body2" component="p">
            {"NFT:  " +
              post.nfts[0].nftCanisterId +
              ": " +
              post.nfts[0].nftTokenIndex}
          </Typography>
        )}
      </CardContent>
      {post.nfts[0] && (
        <Box marginLeft="200px" maxWidth="350px">
          <NftImage
            imageUrl={post.nfts[0].nftOriginalThumbnailUrl}
            canisterId={post.nfts[0].nftCanisterId}
          />
        </Box>
      )}
      <CardContent>
        <Typography variant="body2" component="p">
          {post.words}
        </Typography>
      </CardContent>
      <CardContent>
        <Emojis
          postId={post.postId}
          emojis={post.emoji_reactions}
          clubId={post.clubId}
        />
      </CardContent>
      <CardActions disableSpacing onClick={handlePostClick}>
        <IconButton aria-label="number of replies">
          <ChatBubbleOutline />
        </IconButton>
        <Typography>{post.replies}</Typography>
      </CardActions>
    </Card>
  );
};
