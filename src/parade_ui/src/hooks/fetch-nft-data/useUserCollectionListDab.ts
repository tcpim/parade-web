import {
  NFTCollection,
  getAllUserNFTs,
  getCachedUserNFTs,
} from "@psychedelic/dab-js";
import { useQuery } from "@tanstack/react-query";
import { clubCanisterIds } from "../../components/Nft/nft";

const fetchFromDabCache = async (userPid: string): Promise<NFTCollection[]> => {
  return await getCachedUserNFTs({ userPID: userPid, refresh: false }).then(
    (res) =>
      res.filter((collection) => !clubCanisterIds.has(collection.canisterId))
  );
};

const fetchFromDab = async (userPid: string): Promise<NFTCollection[]> => {
  return await getAllUserNFTs({ user: userPid }).then((res) =>
    res.filter((collection) => !clubCanisterIds.has(collection.canisterId))
  );
};

export const useUserCollectionListDab = (userPid: string) => {
  return useQuery<NFTCollection[], Error>({
    queryKey: ["userCollectionListDab", userPid],
    queryFn: () => fetchFromDabCache(userPid),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
