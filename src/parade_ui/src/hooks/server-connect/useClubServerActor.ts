import { ActorSubclass } from "@dfinity/agent";
import { useContext } from "react";
import { idlFactory as clubServerIdl } from "../../../backend_declarations/club_server";
import { _SERVICE as ClubServerInterface } from "../../../backend_declarations/club_server/ludo_arts_club.did";
import {
  BOXY_DUDE_CLUB_CANISTER,
  CUBETOPIA_CLUB_CANISTER,
  DSCVR_AIRDROP_CLUB_CANISTER,
  IC_PUNKS_CLUB_CANISTER,
  LUDO_ARTS_CLUB_CANISTER,
  MOTOKO_GHOST_CLUB_CANISTER,
  POKED_BOTS_CLUB_CANISTER,
} from "../../../backend_declarations/config";
import { AppContext } from "../../App";
import { useServerActorDev, useServerActorProd } from "./util";

const CLUB_TO_CANISTER: ReadonlyMap<string, string> = new Map([
  ["ludo-arts", LUDO_ARTS_CLUB_CANISTER],
  ["poked-bots", POKED_BOTS_CLUB_CANISTER],
  ["motoko-ghost", MOTOKO_GHOST_CLUB_CANISTER],
  ["ic-punks", IC_PUNKS_CLUB_CANISTER],
  ["dscvr-airdrop", DSCVR_AIRDROP_CLUB_CANISTER],
  ["cubetopia", CUBETOPIA_CLUB_CANISTER],
  ["boxy-dude", BOXY_DUDE_CLUB_CANISTER],
]);

export const useClubServerActor = (
  clubId: string
): ActorSubclass<ClubServerInterface> => {
  const isProd = process.env.NODE_ENV === "production";
  const canisterId = CLUB_TO_CANISTER.get(clubId);
  const appContext = useContext(AppContext);
  const devActor = useServerActorDev(canisterId, "club");
  const prodActor = useServerActorProd(
    canisterId,
    clubServerIdl,
    appContext.userLoginInfo.walletType,
    isProd,
    appContext.userLoginInfo.identity
  );

  return isProd ? prodActor : devActor;
};

export const useClubServerActorMap = (): Map<
  string,
  ActorSubclass<ClubServerInterface>
> => {
  const actorMap = new Map<string, ActorSubclass<ClubServerInterface>>();

  CLUB_TO_CANISTER.forEach((canisterId, clubId) => {
    actorMap.set(clubId, useClubServerActor(clubId));
  });

  return actorMap;
};
