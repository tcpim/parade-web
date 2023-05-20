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

const getEmojiFromUnicode = (emoji: string) => {
  return String.fromCodePoint(parseInt(emoji, 16));
};

export const Emojis = ({ postId, replyId, emojis }: EmojisProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const appContext = useContext(AppContext);
  const reactEmojiMutation = useReactEmoji({
    postId: postId,
    replyId: replyId,
    userPid: appContext.userLoginInfo.userPid,
  });

  const handleEmojiClick = (emoji: any) => {
    reactEmojiMutation.mutate(emoji.unified);
  };

  const handleAddButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      {emojis.map((emoji) => (
        <Container>
          <Typography display="inline">
            {getEmojiFromUnicode(emoji[0])}
          </Typography>
          <Typography display="inline">{emoji[1]}</Typography>
        </Container>
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
