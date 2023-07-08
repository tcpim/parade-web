import { CircularProgress } from "@mui/material";
import * as Menubar from "@radix-ui/react-menubar";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { AppContext, defaultLoginInfo } from "../../../App";
import { useGetUser } from "../../../hooks/user/useGetUser";
import { truncateStr } from "../../../utils/strings";
import { UserAvatar } from "../../Profile/Avatar";
import { CommonContent, CommonItem, CommonTrigger } from "./menuStyles";

const ProfileTrigger = styled(CommonTrigger)`
  background-color: white;
  border: 2px solid rgba(255, 56, 92, 1);
`;

export const ProfileMenu = () => {
  const navigate = useNavigate();
  const appContext = useContext(AppContext);
  const userQuery = useGetUser(appContext.userLoginInfo.userPid);

  if (userQuery.isLoading) {
    return <CircularProgress />;
  } else if (userQuery.isError) {
    return <div>Try again</div>;
  }

  const username = userQuery.data?.username;
  const userId = userQuery.data?.userId;

  const handleLogout = () => {
    appContext.setUserLoginInfo(defaultLoginInfo);
  };

  return (
    <Menubar.Root>
      <Menubar.Menu>
        <ProfileTrigger>
          <UserAvatar userId={userId} size={36} />
          {truncateStr(username ?? userId)}
        </ProfileTrigger>
        <Menubar.Portal>
          <CommonContent sideOffset={10} align="center">
            <CommonItem onClick={() => navigate("/profile")}>
              Profile
            </CommonItem>
            <Menubar.Separator>
              <div style={{ border: "1px solid gray", width: "6rem" }}></div>
            </Menubar.Separator>
            <CommonItem onClick={handleLogout}>Log out</CommonItem>
          </CommonContent>
        </Menubar.Portal>
      </Menubar.Menu>
    </Menubar.Root>
  );
};
