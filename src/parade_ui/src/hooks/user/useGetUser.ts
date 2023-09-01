import { useQuery } from "@tanstack/react-query";
import { User, convertToUser } from "../../types/user";
import { useMainServerActorQuery } from "../server-connect/useMainServerActor";

export function useGetUser(userId: string) {
  const mainServer = useMainServerActorQuery();
  return useQuery<User, Error>({
    queryKey: ["getUser", userId],
    queryFn: async () => {
      const response = await mainServer.get_user_info(userId);
      if (response.user.length === 0) {
        // if user not found
        const user: User = {
          userId: userId,
        };
        return user;
      } else {
        return convertToUser(response.user[0]);
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
