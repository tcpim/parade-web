export interface NftInfo {
  nftCanisterId: string;
  nftTokenIndex: number;
  nftTokenIdentifier: string;
  nftCollectionName: string;
  nftOriginalImageUrl: string;
  nftOriginalThumbnailUrl: string;
  clubId?: string;
}

export const clubCanisterIds: Set<string> = new Set<string>();

// Add items to the hashSet
clubCanisterIds.add("pk6rk-6aaaa-aaaae-qaazq-cai"); //BTC Flower
clubCanisterIds.add("dhiaa-ryaaa-aaaae-qabva-cai"); // ETH Flower
clubCanisterIds.add("4ggk4-mqaaa-aaaae-qad6q-cai"); // ICP Flower
clubCanisterIds.add("skjpp-haaaa-aaaae-qac7q-cai"); // Pineapple Punks
clubCanisterIds.add("2v5zm-uaaaa-aaaae-qaewa-cai"); // Clown Skateboards
clubCanisterIds.add("bzsui-sqaaa-aaaah-qce2a-cai"); // Poked Bots
clubCanisterIds.add("t2mog-myaaa-aaaal-aas7q-cai"); // Pet Bots
clubCanisterIds.add("jv55j-riaaa-aaaal-abvnq-cai"); // Poked Bots Mutant Army
clubCanisterIds.add("oeee4-qaaaa-aaaak-qaaeq-cai"); // Motoko Ghosts
clubCanisterIds.add("ugdkf-taaaa-aaaak-acoia-cai"); // Motoko Mechs
