import { useQuery } from "@tanstack/react-query";

export interface ClubCollectionListData {
  clubs: Club[];
  tokenCount: number;
}

export interface Club {
  club_id: string;
  club_name: string;
  royalty_account: string;
  description: string;
  icon_url: string;
  twitter: string;
  discord: string;
  collections: Collection[];
}

export interface Collection {
  canisterId: string;
  collection_name: string;
  minter_principal: string;
  total_volume: number;
  highest_txn: number;
  lowest_txn: number;
  total_txn_count: number;
  floor: number;
  listings: number;
  supply: number;
  description: string;
  standard: string;
  thumbnail: string;
  ownedTokens: Token[];
}

export interface Token {
  index: number;
  identifier: string;
  image_url: string;
  image_url_onchain: string;
  thum_image_url: string;
  image_type: string;
  image_height_width_ratio: number;
}

const paradeApiHost =
  "https://parade-api-7fuobxt2ia-uw.a.run.app/getUserClubTokens/";

const fetchUserClubCollectionList = async (
  userAccount: string
): Promise<ClubCollectionListData> => {
  const response = await fetch(paradeApiHost + userAccount);
  if (!response.ok) {
    throw new Error("Error fetching user collection list data");
  }
  const data: ClubCollectionListData = await response.json();
  return data;
};

export const useUserAllClubCollectionList = (userAccount: string) => {
  return useQuery<ClubCollectionListData, Error>({
    queryKey: ["useUserAllClubCollectionList", userAccount],
    queryFn: () => fetchUserClubCollectionList(userAccount),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
