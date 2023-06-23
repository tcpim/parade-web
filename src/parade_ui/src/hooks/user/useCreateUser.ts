import { useMutation } from "@tanstack/react-query";
import { useMainServer } from "../useMainServer";

/**
 * Create a user with just user id
 */
export function useCreateUser(userId: string) {
  const mainServer = useMainServer();

  return useMutation({
    mutationFn: () => {
      return mainServer.create_user(userId);
    },
  });
}
