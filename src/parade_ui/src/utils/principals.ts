import { AccountIdentifier } from "@dfinity/nns";
import { Principal } from "@dfinity/principal";

export const getAccountFromPrincipal = (pid: string): string => {
  const principal = Principal.from(pid);
  const accountIdentifier = AccountIdentifier.fromPrincipal({ principal });
  return accountIdentifier.toHex();
};
