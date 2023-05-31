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
import { NftImage } from "../Nft/NftImage";
import { Emojis } from "./Emojis";

interface PostCardProps {
  postId: string;
  createdBy: string;
  timeAgo: string;
  content: string;
  replies: number;
  emojis: Array<[string, number]>;
  nftInfo?: PostNftInfo;
}

interface PostNftInfo {
  nftCanisterId: string;
  nftTokenIndex: number;
  nftImageUrl: string;
}

export const PostCard = ({
  postId,
  createdBy,
  timeAgo,
  content,
  replies,
  emojis,
  nftInfo,
}: PostCardProps) => {
  const navigate = useNavigate();

  const handlePostClick = () => {
    navigate("/post/" + postId);
  };

  return (
    <Card sx={{ marginBottom: 10 }}>
      <CardContent>
        <Typography variant="h6" component="div">
          Created by: {createdBy}
        </Typography>
        <Typography color="text.secondary">{timeAgo}</Typography>
        {nftInfo && (
          <Typography variant="body2" component="p">
            {"NFT:  " + nftInfo.nftCanisterId + ": " + nftInfo.nftTokenIndex}
          </Typography>
        )}
      </CardContent>
      {nftInfo && (
        <Box marginLeft="200px" maxWidth="350px">
          <NftImage
            imageUrl={nftInfo.nftImageUrl}
            canisterId={nftInfo.nftCanisterId}
          />
        </Box>
      )}
      <CardContent>
        <Typography variant="body2" component="p">
          {content}
        </Typography>
      </CardContent>
      <CardContent>
        <Emojis postId={postId} emojis={emojis} />
      </CardContent>
      <CardActions disableSpacing onClick={handlePostClick}>
        <IconButton aria-label="number of replies">
          <ChatBubbleOutline />
        </IconButton>
        <Typography>{replies}</Typography>
      </CardActions>
    </Card>
  );
};
