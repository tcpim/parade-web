import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  SetUserAvatarRequest,
  SetUserBioRequest,
  SetUserInfoResponse,
  SetUserNameRequest,
} from "../../../backend_declarations/main_server/main_server.did";
import { useMainServer } from "../useMainServer";

export function useSetUserName(userId: string, newUsername: string) {
  const mainServer = useMainServer();

  return useMutation({
    mutationFn: (): Promise<SetUserInfoResponse> => {
      const request: SetUserNameRequest = {
        user_id: userId,
        new_name: newUsername,
      };
      console.log("!!1request", request.new_name);
      return mainServer.set_user_name(request);
    },
  });
}

export function useSetUserBio(userId: string, newBio: string) {
  const mainServer = useMainServer();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (): Promise<SetUserInfoResponse> => {
      const request: SetUserBioRequest = {
        user_id: userId,
        bio: newBio,
      };
      console.log("!!1request", request.bio);
      return mainServer.set_user_bio(request);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["getUser", userId]);
    },
  });
}

export function useSetUserAvatar(
  userId: string,
  avatar: Uint8Array,
  mime: string
) {
  const mainServer = useMainServer();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (): Promise<SetUserInfoResponse> => {
      const request: SetUserAvatarRequest = {
        user_id: userId,
        avatar: avatar,
        mime_type: mime,
      };
      return mainServer.set_user_avatar(request);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["getUser", userId]);
    },
  });
}
