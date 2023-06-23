import SaveIcon from "@mui/icons-material/Save";
import {
  Box,
  CircularProgress,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { useContext, useState } from "react";
import { AppContext } from "../../App";
import { useGetUser } from "../../hooks/user/useGetUser";
import { useSetUserBio, useSetUserName } from "../../hooks/user/useSetUserInfo";

export const UserInfo = () => {
  const appContext = useContext(AppContext);
  const userId = appContext.userLoginInfo.userPid;

  const userInfoQuery = useGetUser(userId);
  const [editingUsername, setEditingUsername] = useState(false);
  const [editingUserbio, setEditingUserbio] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newUserbio, setNewUserbio] = useState("");
  const setUserNameMutation = useSetUserName(userId, newUsername);
  const setUserBioMutation = useSetUserBio(userId, newUserbio);

  const username = userInfoQuery.data?.username;
  const userBio = userInfoQuery.data?.bio;

  const handleSaveUsername = () => {
    setUserNameMutation.mutate();
  };

  const handleSaveBio = () => {
    setUserBioMutation.mutate();
  };

  const userNameButton = () => {
    if (setUserNameMutation.data?.error[0]) {
      return (
        <Typography color="red">
          user name exists. please choose another one
        </Typography>
      );
    } else if (setUserNameMutation.isLoading) {
      return <CircularProgress />;
    }
    if (newUsername !== "") {
      return (
        <IconButton onClick={handleSaveUsername}>
          <SaveIcon fontSize="small" />
        </IconButton>
      );
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      marginLeft="20%"
    >
      <Typography>Principal ID: {appContext.userLoginInfo.userPid}</Typography>
      <Box display="flex">
        <Typography alignContent="center" marginRight="5px" marginTop="3px">
          User name:{" "}
        </Typography>
        <TextField
          id="user-name"
          placeholder="Choose your username"
          variant="standard"
          value={newUsername === "" ? username : newUsername}
          InputProps={{
            disableUnderline: !editingUsername,
          }}
          onClick={() => setEditingUsername(true)}
          onBlur={() => setEditingUsername(false)}
          onChange={(e) => setNewUsername(e.target.value)}
        />
        {userNameButton()}
      </Box>
      <Box display="flex">
        <Typography alignContent="center" marginRight="5px" marginTop="3px">
          User bio:{" "}
        </Typography>
        <TextField
          id="user-bio"
          placeholder="Tell about yourself"
          variant="standard"
          value={newUserbio === "" ? userBio : newUserbio}
          onClick={() => setEditingUserbio(true)}
          onBlur={() => setEditingUserbio(false)}
          InputProps={{
            disableUnderline: !editingUserbio,
          }}
          onChange={(e) => setNewUserbio(e.target.value)}
        />
        {newUserbio !== "" && (
          <IconButton onClick={handleSaveBio}>
            <SaveIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};
