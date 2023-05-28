import { useQuery } from "@tanstack/react-query";

export interface CollectionListData {
  collections: Collection[];
}

export interface Collection {
  canisterId: string;
  collectionName: string;
  tokens: Token[];
}

export interface Token {
  index: number;
  identifier: string;
  originalImage: string;
  smallImage: string;
}

const paradeApiHost =
  "https://parade-api-7fuobxt2ia-uw.a.run.app/getUserTokens/";

const fetchUserCollectionList = async (
  userAccount: string
): Promise<CollectionListData> => {
  const response = await fetch(paradeApiHost + userAccount);
  if (!response.ok) {
    throw new Error("Error fetching user collection list data");
  }
  const data: CollectionListData = await response.json();
  return data;
};

export const useUserCollectionList = (userAccount: string) => {
  return useQuery<CollectionListData, Error>(
    ["userCollectionList", userAccount],
    () => fetchUserCollectionList(userAccount)
  );
};
