import { useInfiniteQuery } from "@tanstack/react-query";
import { GetClubMessagesRequest } from "../../../backend_declarations/club_server/ludo_arts_club.did";
import { Message, MessagePage, convertToMessage } from "../../types/message";
import { DEFAULT_PAGE_SIZE_FOR_MESSAGES } from "../../utils/constants";
import { useClubServerActorQuery } from "../server-connect/useClubServerActor";

const getFetchRequest = (cursor: [] | [bigint]): GetClubMessagesRequest => {
  return {
    cursor: cursor,
    limit: [DEFAULT_PAGE_SIZE_FOR_MESSAGES],
  };
};

export const useGetMessages = (clubId: string) => {
  const clubServer = useClubServerActorQuery(clubId);

  return useInfiniteQuery<MessagePage, Error>({
    queryKey: ["clubMessages", clubId],
    queryFn: async ({ pageParam = [] }) => {
      if (clubServer === undefined) {
        throw new Error("Club server is undefined");
      }
      const request = getFetchRequest(pageParam);
      const response = await clubServer.get_club_messages(request);

      const result: MessagePage = {
        messages: response.messages
          .map((msg) => convertToMessage(msg))
          .filter((msg) => msg !== undefined) as Message[],
        next_cursor: response.next_cursor,
      };

      return result;
    },
    getPreviousPageParam: (lastPage, pages) => {
      if (lastPage.next_cursor.length === 0) {
        return undefined;
      } else {
        return lastPage.next_cursor;
      }
    },
    keepPreviousData: true,
    refetchInterval: 10 * 1000, // 5 seconds
  });
};
