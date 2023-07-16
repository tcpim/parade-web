import { NftToken as ClubNftToken } from "../../backend_declarations/club_server/ludo_arts_club.did";
import { NftToken as StreetNftToken } from "../../backend_declarations/main_server/main_server.did";

export interface NftInfo {
  canisterId: string;
  tokenIndex: number;
  tokenIdentifier: string;
  collectionName: string;
  imageUrl: string;
  imageUrlOnChain: string;
  imageThumbnailUrl: string;
  imageType: string; // default is img
  imageHeightWidthRatio: number | undefined; // default is undefined that means go with original image ratio
  clubId: string | undefined;
}

export const defaultNftInfo: NftInfo = {
  canisterId: "",
  tokenIndex: 0,
  tokenIdentifier: "",
  collectionName: "",
  imageUrl: "",
  imageUrlOnChain: "",
  imageThumbnailUrl: "",
  imageType: "img",
  imageHeightWidthRatio: undefined,
  clubId: undefined,
};

export const converToNftInfo = (
  nft: StreetNftToken | ClubNftToken
): NftInfo => {
  let res: NftInfo = {
    canisterId: nft.canister_id,
    tokenIndex: nft.token_index,
    tokenIdentifier: nft.token_id,
    imageUrl: nft.image_url,
    imageUrlOnChain: nft.image_url,
    imageThumbnailUrl: nft.image_thumbnail_url,
    collectionName: nft.collection_name,
    imageType: "img",
    imageHeightWidthRatio: undefined,
    clubId: undefined,
  };

  if ("club_id" in nft) {
    res.clubId = nft.club_id;
  }

  if ("image_type" in nft) {
    res.imageType = nft.image_type;
  }

  if ("image_height_width_ratio" in nft) {
    res.imageHeightWidthRatio = parseFloat(nft.image_height_width_ratio);
  }

  if ("image_onchain_url" in nft) {
    res.imageUrlOnChain = nft.image_onchain_url;
  }

  return res;
};
