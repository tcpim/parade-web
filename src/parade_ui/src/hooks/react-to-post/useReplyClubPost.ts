import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";
import {
  GetPostRepliesResponse,
  ReplyPostRequest,
  ReplyPostResponse,
} from "../../../backend_declarations/club_server/ludo_arts_club.did";
import { useClubServerActorUpdate } from "../server-connect/useClubServerActor";

export interface CreatePostReplyProps {
  userPid: string;
  postId: string;
  words: string;
  clubId: string;
  onSuccessCallback: () => void;
}

const getReplyPostRequest = (props: CreatePostReplyProps): ReplyPostRequest => {
  return {
    reply_id: uuidv4(),
    post_id: props.postId,
    user: props.userPid,
    created_ts: BigInt(Date.now()),
    words: props.words,
    nfts: [],
  };
};

export const useReplyClubPost = (props: CreatePostReplyProps) => {
  const queryClient = useQueryClient();
  const clubServer = useClubServerActorUpdate(props.clubId);
  const addReply = async (
    props: CreatePostReplyProps
  ): Promise<ReplyPostResponse> => {
    const request = getReplyPostRequest(props);

    if (clubServer === undefined) {
      throw new Error("Club server is undefined");
    }
    const res = await clubServer.reply_post(request);
    if (res.error[0] != undefined) {
      throw new Error("Error club reply_post: " + res.error[0].error_message);
    }

    return res;
  };

  const mutation = useMutation(() => addReply(props), {
    onSuccess: () => {
      props.onSuccessCallback();
      const newReply = {
        id: "newReply",
        post_id: props.postId,
        emoji_reactions: [],
        nfts: [],
        created_by: props.userPid,
        created_ts: BigInt(Date.now()),
        words: props.words,
      };

      queryClient.setQueryData<InfiniteData<GetPostRepliesResponse>>(
        ["clubPostReplies", props.postId, props.clubId],
        (oldData) => {
          if (oldData === undefined) {
            return undefined;
          }
          const oldFirstPage: GetPostRepliesResponse = oldData.pages[0];

          const newFirstPage = {
            ...oldFirstPage,
            post_replies: [newReply, ...oldFirstPage.post_replies],
          };
          return {
            pages: [newFirstPage, ...oldData.pages.slice(1)],
            pageParams: oldData.pageParams,
          };
        }
      );
    },
  });

  return mutation;
};
