import { useQuery } from "@tanstack/react-query";
import { User, convertToUser } from "../../types/user";
import { useMainServer } from "../useMainServer";

export function useGetUser(userId: string) {
  const mainServer = useMainServer();
  return useQuery<User, Error>({
    queryKey: ["getUser", userId],
    queryFn: async () => {
      const response = await mainServer.get_user_info(userId);
      if (response.user.length === 0) {
        const user: User = {
          userId: userId,
        };
        return user;
      } else {
        return convertToUser(response.user[0]);
      }
    },
  });
}
