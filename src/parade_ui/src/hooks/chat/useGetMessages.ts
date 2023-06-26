import { useInfiniteQuery } from "@tanstack/react-query";
import { GetClubMessagesRequest } from "../../../backend_declarations/club_server/ludo_arts_club.did";
import { Message, MessagePage, convertToMessage } from "../../types/message";
import { DEFAULT_PAGE_SIZE_FOR_MESSAGES } from "../../utils/constants";
import { getClubServer } from "../useClubServer";

const getFetchRequest = (cursor: [] | [bigint]): GetClubMessagesRequest => {
  return {
    cursor: cursor,
    limit: [DEFAULT_PAGE_SIZE_FOR_MESSAGES],
  };
};

export const useGetMessages = (clubId: string) => {
  const clubServer = getClubServer(clubId);

  return useInfiniteQuery<MessagePage, Error>({
    queryKey: ["messages", clubId],
    queryFn: async ({ pageParam = [] }) => {
      const request = getFetchRequest(pageParam);
      const response = await clubServer.get_club_messages(request);

      const result: MessagePage = {
        messages: response.messages
          .map((msg) => convertToMessage(msg))
          .filter((msg) => msg !== undefined) as Message[],
        next_cursor: response.next_cursor,
      };

      console.log("!! finish fetching");
      for (const message of result.messages) {
        console.log("!! useGetMessages", message.words);
      }

      return result;
    },
    getPreviousPageParam: (lastPage, pages) => {
      if (lastPage.next_cursor.length === 0) {
        console.log("!! no more page");
        return undefined;
      } else {
        console.log("!! next page cursor" + lastPage.next_cursor[0].toString());
        return lastPage.next_cursor;
      }
    },
    keepPreviousData: true,
  });
};
