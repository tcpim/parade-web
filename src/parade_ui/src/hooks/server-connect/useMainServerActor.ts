import { ActorSubclass } from "@dfinity/agent";
import { useContext } from "react";
import { MAIN_SERVER_CANISTER } from "../../../backend_declarations/config";
import { idlFactory } from "../../../backend_declarations/main_server";
import { _SERVICE as MainServerInterface } from "../../../backend_declarations/main_server/main_server.did";
import { AppContext } from "../../App";
import { useServerActorDev, useServerActorProd } from "./util";

export const useMainServerActor = (): ActorSubclass<MainServerInterface> => {
  const isProd = process.env.NODE_ENV === "production";
  const appContext = useContext(AppContext);
  const devActor = useServerActorDev(MAIN_SERVER_CANISTER, "main");
  const prodActor = useServerActorProd(
    MAIN_SERVER_CANISTER,
    idlFactory,
    appContext.userLoginInfo.walletType,
    isProd,
    appContext.userLoginInfo.identity
  );

  return isProd ? prodActor : devActor;
};
