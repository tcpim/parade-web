export interface ClubInfo {
  name: string;
  description: string;
  twitter: string;
  discord: string;
  website: string;
  collections: ClubCollection[];
}

export interface ClubCollection {
  name: string;
  canisterId: string;
  tradeUrl: string;
}

export type ClubMap = Record<string, ClubInfo>;

export const clubs: ClubMap = {
  "ludo-arts": {
    name: "Ludo Arts",
    description: "",
    twitter: "https://twitter.com/btcflower",
    discord: "https://discord.com/channels/897536129803378758",
    website: "https://fpdao.app/",
    collections: [
      {
        name: "BTC Flower",
        canisterId: "pk6rk-6aaaa-aaaae-qaazq-cai",
        tradeUrl: "https://toniq.io/marketplace/btcflower",
      },
      {
        name: "ETH Flower",
        canisterId: "dhiaa-ryaaa-aaaae-qabva-cai",
        tradeUrl: "https://toniq.io/marketplace/ethflower",
      },
      {
        name: "ICP Flower",
        canisterId: "4ggk4-mqaaa-aaaae-qad6q-cai",
        tradeUrl: "https://toniq.io/marketplace/icp-flower",
      },
      {
        name: "Pineapple Punks",
        canisterId: "skjpp-haaaa-aaaae-qac7q-cai",
        tradeUrl: "https://toniq.io/marketplace/pineapple-punks",
      },
      {
        name: "Clown Skateboards",
        canisterId: "2v5zm-uaaaa-aaaae-qaewa-cai",
        tradeUrl: "https://toniq.io/marketplace/clown-skateboards",
      },
      {
        name: "Cherries",
        canisterId: "y2ga5-lyaaa-aaaae-qae2q-cai",
        tradeUrl: "https://toniq.io/marketplace/cherries",
      },
      {
        name: "FPDAO Flower",
        canisterId: "t3drq-7iaaa-aaaae-qac2a-cai",
        tradeUrl: "https://toniq.io/marketplace/cherries",
      },
    ],
  },
  "poked-bots": {
    name: "Poked Bots",
    description: "",
    twitter: "https://twitter.com/pokedstudiouk",
    discord: "https://discord.com/channels/886922354209472522/",
    website: "",
    collections: [
      {
        name: "Poked Bots",
        canisterId: "bzsui-sqaaa-aaaah-qce2a-cai",
        tradeUrl: "https://toniq.io/marketplace/poked",
      },
      {
        name: "Poked Bots Mutant Army",
        canisterId: "jv55j-riaaa-aaaal-abvnq-cai",
        tradeUrl: "https://toniq.io/marketplace/pokedbots-mutant-army",
      },
    ],
  },
  "motoko-ghost": {
    name: "Motoko Ghosts",
    description: "",
    twitter: "",
    discord: "",
    website: "",
    collections: [
      {
        name: "Motoko Ghosts",
        canisterId: "oeee4-qaaaa-aaaak-qaaeq-cai",
        tradeUrl: "https://toniq.io/marketplace/motoko",
      },
      {
        name: "Motoko Mechs",
        canisterId: "ugdkf-taaaa-aaaak-acoia-cai",
        tradeUrl: "https://toniq.io/marketplace/motoko-mechs",
      },
    ],
  },
};
