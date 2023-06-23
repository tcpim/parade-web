import { User as UserBackend } from "../../backend_declarations/main_server/main_server.did";

export interface User {
  userId: string; // wallet principal id
  username?: string;
  avatar?: UserAvatar;
  bio?: string;
}

export interface UserAvatar {
  data: Uint8Array;
  avatarMime: string;
}

export const convertToUser = (userBackend: UserBackend): User => {
  const user: User = {
    userId: userBackend.id,
    username:
      userBackend.user_name.length !== 0 ? userBackend.user_name[0] : undefined,
    bio: userBackend.bio.length !== 0 ? userBackend.bio[0] : undefined,
  };

  if (userBackend.avatar.length !== 0) {
    let avatar: UserAvatar = {
      data: userBackend.avatar[0].data as Uint8Array,
      avatarMime: userBackend.avatar[0].mime_type,
    };
    user.avatar = avatar;
  }

  return user;
};
