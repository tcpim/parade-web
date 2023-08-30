import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  SetUserAvatarRequest,
  SetUserBioRequest,
  SetUserInfoResponse,
  SetUserNameRequest,
} from "../../../backend_declarations/main_server/main_server.did";
import { useMainServerActor } from "../server-connect/useMainServerActor";

export function useSetUserName(
  userId: string,
  newUsername: string,
  onSuccessCallback?: any
) {
  const mainServer = useMainServerActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (): Promise<SetUserInfoResponse> => {
      const request: SetUserNameRequest = {
        user_id: userId,
        new_name: newUsername,
      };
      return mainServer.set_user_name(request);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["getUser", userId]);
      onSuccessCallback();
    },
  });
}

export function useSetUserBio(
  userId: string,
  newBio: string,
  onSuccessCallback?: any
) {
  const mainServer = useMainServerActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (): Promise<SetUserInfoResponse> => {
      const request: SetUserBioRequest = {
        user_id: userId,
        bio: newBio,
      };
      return mainServer.set_user_bio(request);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["getUser", userId]);
      onSuccessCallback();
    },
  });
}

export function useSetUserAvatar(
  userId: string,
  avatar: Uint8Array,
  mime: string
) {
  const mainServer = useMainServerActor();
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
