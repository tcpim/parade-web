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

interface PostCardProps {
  createdBy: string;
  timeAgo: string;
  content: string;
  replies: number;
  nftCanisterId: string;
  nftTokenIndex: number;
}

export const PostCard = ({
  createdBy,
  timeAgo,
  content,
  replies,
  nftCanisterId,
  nftTokenIndex,
}: PostCardProps) => {
  return (
    <Card sx={{ marginBottom: 2 }}>
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
      <CardActions disableSpacing>
        <IconButton aria-label="number of replies">
          <ChatBubbleOutline />
        </IconButton>
        <Typography>{replies}</Typography>
      </CardActions>
    </Card>
  );
};
