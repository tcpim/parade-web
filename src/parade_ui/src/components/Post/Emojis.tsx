import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Container,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useCallback, useContext, useState } from "react";
import { useReactEmoji } from "../../hooks/useReactEmoji";
import { AppContext } from "../../App";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";

interface EmojiPickerProps {
  handleEmojiClick: (emoji: any) => void;
}

const EmojiPicker = ({ handleEmojiClick }: EmojiPickerProps) => {
  return (
    <Picker
      data={data}
      onEmojiSelect={handleEmojiClick}
      categories={["frequent", "people", "nature", "foods", "flags"]}
    />
  );
};

export interface EmojisProps {
  postId?: string;
  replyId?: string;
  emojis: Array<[string, number]>;
}

export const Emojis = ({ postId, replyId, emojis }: EmojisProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [emojisCount, setEmojisCount] =
    useState<Array<[string, number]>>(emojis);
  const appContext = useContext(AppContext);
  const reactEmojiMutation = useReactEmoji({
    postId: postId,
    replyId: replyId,
    userPid: appContext.userLoginInfo.userPid,
  });

  // for emoji picker anchor
  const open = Boolean(anchorEl);
  const handleClose = () => {
    setAnchorEl(null);
  };

  // handle click events
  const handleEmojiClick = (emoji: any) => {
    reactEmojiMutation.mutate(emoji.unified);
    increaseEmojiCount(emoji.unified);
  };
  const handleAddButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handlePlusOneClick = (emoji: string) => {
    reactEmojiMutation.mutate(emoji);
    increaseEmojiCount(emoji);
  };

  // helpers
  const increaseEmojiCount = (emoji: string) => {
    const index = emojisCount.findIndex((e) => e[0] === emoji);
    let updatedEmojisCount = [...emojisCount];
    if (index !== -1) {
      updatedEmojisCount[index] = [emoji, updatedEmojisCount[index][1] + 1];
    } else {
      updatedEmojisCount.push([emoji, 1]);
    }
    setEmojisCount(updatedEmojisCount);
    console.log(updatedEmojisCount);
  };

  const getEmojiFromUnicode = (emoji: string) => {
    return String.fromCodePoint(parseInt(emoji, 16));
  };

  return (
    <Box display="flex" flexWrap="wrap">
      {emojisCount.map((emoji) => (
        <IconButton
          onClick={() => handlePlusOneClick(emoji[0])}
          color="primary"
          key={emoji[0]}
        >
          <Typography display="inline">
            {getEmojiFromUnicode(emoji[0])}
          </Typography>
          <Typography display="inline">{emoji[1]}</Typography>
        </IconButton>
      ))}
      <Box>
        <IconButton color="primary" onClick={handleAddButtonClick}>
          <AddCircleOutlineIcon />
        </IconButton>
        <Menu
          id="emoji-picker"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <EmojiPicker handleEmojiClick={handleEmojiClick} />
        </Menu>
      </Box>
    </Box>
  );
};
