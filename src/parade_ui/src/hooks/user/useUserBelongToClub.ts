import { useUserCollectionListForClub } from "../fetch-nft-data/useUserCollectionListForClub";

export const useUserBelongToClub = (userAccount: string, clubId: string) => {
  const query = useUserCollectionListForClub(userAccount, clubId);

  if (query.isFetching || query.isLoading || query.isError || !query.data) {
    return false;
  }
  return query.data.tokenCount !== 0;
};
