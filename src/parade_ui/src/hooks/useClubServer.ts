import { useMemo } from "react";
import { createActor } from "../../backend_declarations/club_server";
import {
  LUDO_ARTS_CLUB_CANISTER,
  MOTOKO_GHOST_CLUB_CANISTER,
  POKED_BOTS_CLUB_CANISTER,
} from "../../backend_declarations/config";

export const useClubServer = (clubId: string) => {
  let canister = "";
  switch (clubId) {
    case "ludo-arts":
      canister = LUDO_ARTS_CLUB_CANISTER;
      break;
    case "poked-bots":
      canister = POKED_BOTS_CLUB_CANISTER;
      break;
    case "motoko-ghost":
      canister = MOTOKO_GHOST_CLUB_CANISTER;
      break;
    default:
      canister = LUDO_ARTS_CLUB_CANISTER; // default to ludo flowers
      break;
  }

  return useMemo(() => createActor(canister), []);
};

export const getClubServer = (clubId: string) => {
  let canister = "";
  switch (clubId) {
    case "ludo-arts":
      canister = LUDO_ARTS_CLUB_CANISTER;
      break;
    case "poked-bots":
      canister = POKED_BOTS_CLUB_CANISTER;
      break;
    case "motoko-ghost":
      canister = MOTOKO_GHOST_CLUB_CANISTER;
      break;
    default:
      canister = LUDO_ARTS_CLUB_CANISTER; // default to ludo flowers
      break;
  }

  return createActor(canister);
};
