import { User } from "../types/user";
import { truncateStr } from "./strings";

export const getUserName = (user: User | undefined) => {
  if (user === undefined) {
    return "";
  } else if (user.username) {
    return truncateStr(user.username, 10);
  } else {
    return truncateStr(user.userId, 10);
  }
};
