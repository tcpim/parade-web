import { useQuery } from "@tanstack/react-query";
import { Collection } from "./useUserAllClubCollectionList";

export interface CollectionListData {
  collections: Collection[];
  tokenCount: number;
}

const paradeApiHost =
  "https://parade-api-7fuobxt2ia-uw.a.run.app/getUserTokensForClub/";

const fetchUserClubCollectionList = async (
  userAccount: string,
  clubId: string
): Promise<CollectionListData> => {
  if (userAccount === "" || clubId === "") {
    return Promise.resolve({ collections: [], tokenCount: 0 });
  }
  const response = await fetch(paradeApiHost + userAccount + "/" + clubId);
  if (!response.ok) {
    throw new Error("Error fetching user collection list data for club");
  }
  const data: CollectionListData = await response.json();
  return data;
};

export const useUserCollectionListForClub = (
  userAccount: string,
  clubId: string
) => {
  return useQuery<CollectionListData, Error>(
    ["useUserCollectionListForClub", userAccount, clubId],
    () => fetchUserClubCollectionList(userAccount, clubId)
  );
};
