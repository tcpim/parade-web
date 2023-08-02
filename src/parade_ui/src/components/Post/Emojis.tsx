import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import * as Popover from "@radix-ui/react-popover";
import { useContext, useState } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { styled } from "styled-components";
import { AppContext } from "../../App";
import { useReactEmojiClub } from "../../hooks/react-to-post/useReactEmojiClub";
import { useReactEmojiStreet } from "../../hooks/react-to-post/useReactEmojiStreet";

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 1rem 0;
`;

const EmojiButton = styled.button`
  border: none;
  border-radius: 1rem;
  width: 3rem;
  height: 1.5rem;
  padding: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;

  &:disabled {
    cursor: not-allowed;
  }
`;

const EmojiDiv = styled.div`
  border: none;
  border-radius: 1rem;
  width: 3rem;
  height: 1.5rem;
  padding: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const EmojiAddButton = styled.button`
  border: none;
  border-radius: 0.5rem;
  width: 2.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    cursor: pointer;
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

const getEmojiFromUnicode = (emoji: string) => {
  return String.fromCodePoint(parseInt(emoji, 16));
};

export interface EmojisProps {
  autherId: string;
  postId?: string;
  replyId?: string;
  clubId?: string;
  emojis: Array<[string, number]>;
}

export const Emojis = ({
  autherId,
  postId,
  replyId,
  emojis,
  clubId,
}: EmojisProps) => {
  const [emojisCount, setEmojisCount] =
    useState<Array<[string, number]>>(emojis);
  const appContext = useContext(AppContext);
  const streetMutation = useReactEmojiStreet({
    postId: postId,
    replyId: replyId,
    userPid: appContext.userLoginInfo.userPid,
  });
  const clubMutation = useReactEmojiClub({
    postId: postId,
    replyId: replyId,
    userPid: appContext.userLoginInfo.userPid,
    clubId: clubId ?? "",
  });

  const mutation = clubId ? clubMutation : streetMutation;
  const cannotMutate =
    !appContext.userLoginInfo.walletConnected ||
    appContext.userLoginInfo.userPid === autherId;

  // handle click events
  const handleEmojiClick = (emoji: any) => {
    mutation.mutate(emoji.unified);
    increaseEmojiCount(emoji.unified);
  };

  const handlePlusOneClick = (emoji: string) => {
    mutation.mutate(emoji);
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
  };

  const emojiWrapper = (emoji: string, count: number) => {
    if (cannotMutate) {
      return (
        <EmojiDiv key={emoji}>
          {getEmojiFromUnicode(emoji)}
          {count}
        </EmojiDiv>
      );
    } else {
      return (
        <EmojiButton
          onClick={() => handlePlusOneClick(emoji)}
          key={emoji}
          disabled={cannotMutate}
        >
          {getEmojiFromUnicode(emoji)}
          {count}
        </EmojiButton>
      );
    }
  };

  const EmojiPopover = () => {
    return (
      <Popover.Root>
        <Popover.Trigger asChild>
          <EmojiAddButton disabled={cannotMutate}>
            <AiOutlinePlusCircle />
          </EmojiAddButton>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content side="top" sideOffset={5} align="start">
            <Picker
              data={data}
              onEmojiSelect={handleEmojiClick}
              categories={["frequent", "people", "nature", "foods", "flags"]}
            />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    );
  };

  return (
    <Wrapper>
      {emojisCount.map((emoji) => emojiWrapper(emoji[0], emoji[1]))}
      {EmojiPopover()}
    </Wrapper>
  );
};
