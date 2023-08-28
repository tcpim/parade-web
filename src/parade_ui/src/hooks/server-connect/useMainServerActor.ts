import { Actor, HttpAgent, Identity } from "@dfinity/agent";
import { useContext, useEffect, useMemo, useState } from "react";
import { MAIN_SERVER_CANISTER } from "../../../backend_declarations/config";
import {
  createActor,
  idlFactory,
} from "../../../backend_declarations/main_server";
import { AppContext, WalletType } from "../../App";

export const useMainServerActor = () => {
  const isProd = process.env.NODE_ENV === "production";
  const appContext = useContext(AppContext);
  const devActor = useMainServerActorDev();
  const prodActor = useMainServerActorProd(
    MAIN_SERVER_CANISTER,
    idlFactory,
    appContext.userLoginInfo.walletType,
    isProd,
    appContext.userLoginInfo.identity
  );

  return isProd ? prodActor : devActor;
};

const useMainServerActorDev = () => {
  return useMemo(() => createActor(MAIN_SERVER_CANISTER), []);
};

const useMainServerActorProd = (
  canisterId: string,
  idlFactory: any,
  wallet: WalletType,
  shouldRun: boolean,
  identity?: Identity
) => {
  if (!shouldRun) {
    return null;
  }

  const [actor, setActor] = useState<any | undefined>();

  console.log(canisterId, wallet, identity, actor);
  useEffect(() => {
    const constructActor = async () => {
      const actor = await getActor(canisterId, idlFactory, wallet, identity);
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

  return plugActor;
};
