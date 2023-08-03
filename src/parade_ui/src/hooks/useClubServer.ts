import { ActorSubclass } from "@dfinity/agent";
import { useErrorBoundary } from "react-error-boundary";
import { createActor } from "../../backend_declarations/club_server";
import { _SERVICE } from "../../backend_declarations/club_server/ludo_arts_club.did";
import {
  LUDO_ARTS_CLUB_CANISTER,
  MOTOKO_GHOST_CLUB_CANISTER,
  POKED_BOTS_CLUB_CANISTER,
} from "../../backend_declarations/config";

const CLUBS: ReadonlyMap<string, ActorSubclass<_SERVICE>> = new Map([
  ["ludo-arts", createActor(LUDO_ARTS_CLUB_CANISTER)],
  ["poked-bots", createActor(POKED_BOTS_CLUB_CANISTER)],
  ["motoko-ghost", createActor(MOTOKO_GHOST_CLUB_CANISTER)],
]);

export const getClubServer = (clubId: string) => {
  const server = CLUBS.get(clubId);
  const { showBoundary } = useErrorBoundary();
  if (server === undefined) {
    showBoundary(new Error("Invalid club id to get club server"));
  }

  return server;
};
