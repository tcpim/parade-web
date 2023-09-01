import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  SetUserAvatarRequest,
  SetUserBioRequest,
  SetUserInfoResponse,
  SetUserNameRequest,
} from "../../../backend_declarations/main_server/main_server.did";
import {
  useMainServerActorQuery,
  useMainServerActorUpdate,
} from "../server-connect/useMainServerActor";

export function useSetUserName(
  userId: string,
  newUsername: string,
  onSuccessCallback?: any
) {
  const mainServer = useMainServerActorUpdate();
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
  const mainServer = useMainServerActorUpdate();
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
  // use query client because setting avartar with plug identity doesn't work somehow
  const mainServer = useMainServerActorQuery();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<SetUserInfoResponse> => {
      const request: SetUserAvatarRequest = {
        user_id: userId,
        avatar: avatar,
        mime_type: mime,
      };
      const res = await mainServer.set_user_avatar(request);
      if (res.error[0] != undefined) {
        console.log("useSetUserAvatar error: " + res.error[0].error_message);
      } else {
        console.log("useSetUserAvatar res: " + res.user);
      }
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["getUser", userId]);
    },
  });
}
