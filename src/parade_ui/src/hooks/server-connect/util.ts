import { Actor, HttpAgent, Identity } from "@dfinity/agent";
import { useEffect, useMemo, useState } from "react";
import { createActor as clubCreateActor } from "../../../backend_declarations/club_server";
import { createActor as mainCreateActor } from "../../../backend_declarations/main_server";
import { WalletType } from "../../App";

export const useServerActorDev = (
  canisterId: string | undefined,
  serverType: "club" | "main"
) => {
  return useMemo(() => {
    if (canisterId === undefined) {
      return undefined;
    } else {
      return serverType === "club"
        ? clubCreateActor(canisterId)
        : mainCreateActor(canisterId);
    }
  }, [canisterId, serverType]);
};

export const useServerActorProd = (
  canisterId: string | undefined,
  idlFactory: any,
  wallet: WalletType,
  shouldRun: boolean,
  identity?: Identity
) => {
  if (!shouldRun) {
    return null;
  }

  const [actor, setActor] = useState<any | undefined>();

  useEffect(() => {
    const constructActor = async () => {
      const actor = await getActor(
        canisterId ?? "",
        idlFactory,
        wallet,
        identity
      );
      setActor(actor);
    };
    constructActor();
  }, [canisterId, idlFactory, wallet, identity]);

  return actor;
};

const getActor = async (
  canisterId: string,
  idlFactory: any,
  wallet: WalletType,
  identity?: Identity
) => {
  if (wallet === "plug") {
    const plugActor = await getPlugActor(canisterId, idlFactory);
    return plugActor;
  } else if (wallet === "stoic" && identity) {
    return getGeneralActors(identity, canisterId, idlFactory);
  }

  return undefined;
};

const getGeneralActors = (
  identity: Identity,
  canisterId: string,
  idlFactory: any
) => {
  return Actor.createActor(idlFactory, {
    canisterId: canisterId,
    agent: new HttpAgent({
      identity: identity,
      host: "https://ic0.app",
    }),
  });
};

const getPlugActor = async (canisterId: string, idlFactory: any) => {
  const plugActor = await window.ic.plug.createActor({
    canisterId: canisterId,
    interfaceFactory: idlFactory,
  });

  console.log("!!plug" + plugActor);
  return plugActor;
};
