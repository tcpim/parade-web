import { NftToken as ClubNftToken } from "../../backend_declarations/club_server/ludo_arts_club.did";
import { NftToken as StreetNftToken } from "../../backend_declarations/main_server/main_server.did";

export interface NftInfo {
  nftCanisterId: string;
  nftTokenIndex: number;
  nftTokenIdentifier: string;
  nftCollectionName: string;
  nftOriginalImageUrl: string;
  nftOriginalThumbnailUrl: string;
  clubId?: string;
}

export const converToNftInfo = (
  nft: StreetNftToken | ClubNftToken
): NftInfo => {
  return {
    nftCanisterId: nft.canister_id,
    nftTokenIndex: nft.token_index,
    nftTokenIdentifier: nft.token_id,
    nftOriginalImageUrl: nft.original_image_url,
    nftOriginalThumbnailUrl: nft.original_thumbnail_url,
    nftCollectionName: nft.collection_name,
  };
};
