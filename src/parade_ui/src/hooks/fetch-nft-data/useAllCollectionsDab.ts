import { DABCollection, NFTCollection, getAllNFTS } from "@psychedelic/dab-js";
import { useQuery } from "@tanstack/react-query";
import { clubCanisterIds } from "../../components/Nft/nft";

const fetchFromDab = async (): Promise<DABCollection[]> => {
  return await getAllNFTS();
};

export const useAllCollectionsDab = () => {
  return useQuery<DABCollection[], Error>(["allCollections"], {
    queryFn: () => fetchFromDab(),
  });
};
