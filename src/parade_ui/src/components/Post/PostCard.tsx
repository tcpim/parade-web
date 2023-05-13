import React, { FC } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Chip,
} from "@mui/material";
import { ChatBubbleOutline, Favorite } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

interface PostCardProps {
  postId: string;
  createdBy: string;
  timeAgo: string;
  content: string;
  replies: number;
  nftCanisterId: string;
  nftTokenIndex: number;
}

export const PostCard = ({
  postId,
  createdBy,
  timeAgo,
  content,
  replies,
  nftCanisterId,
  nftTokenIndex,
}: PostCardProps) => {
  const navigate = useNavigate();

  const handlePostClick = () => {
    navigate("/post/" + postId);
  };

  return (
    <Card sx={{ marginBottom: 20 }}>
      <CardContent>
        <Typography variant="h6" component="div">
          {createdBy}
        </Typography>
        <Typography color="text.secondary">{timeAgo}</Typography>
        <Typography variant="body2" component="p">
          {"NFT:  " + nftCanisterId + ": " + nftTokenIndex}
        </Typography>
        <Typography variant="body2" component="p">
          {content}
        </Typography>
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
