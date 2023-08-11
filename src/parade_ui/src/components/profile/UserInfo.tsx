import { CircularProgress } from "@mui/material";
import { useContext, useState } from "react";
import { AiOutlineCheck, AiOutlineClose, AiOutlineEdit } from "react-icons/ai";
import { styled } from "styled-components";
import { AppContext } from "../../App";
import { useGetUser } from "../../hooks/user/useGetUser";
import { useSetUserBio, useSetUserName } from "../../hooks/user/useSetUserInfo";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-left: 10rem;
  gap: 1rem;
`;

const StyledEditor = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

interface InputProps {
  isActive: boolean;
}

const StyledInput = styled.input<InputProps>`
  all: unset;
  display: inline-flex;
  padding: 0.5rem 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid ${(props) => (props.isActive ? "#638ef4" : "#8f8d8d")};
`;

const StyledTextArea = styled.textarea<InputProps>`
  all: unset;
  display: inline-flex;
  padding: 0.5rem 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid ${(props) => (props.isActive ? "#638ef4" : "#8f8d8d")};
`;

const StyledEditButton = styled.button`
  background-color: transparent;
  border: none;
  &:hover {
    cursor: pointer;
    box-shadow: 2px 2px 2px rgba(255, 56, 92, 1);
  }
`;

const StyledLabel = styled.p`
  width: 6rem;
`;

interface UserInfoProps {
  userId: string;
}

export const UserInfo = ({ userId }: UserInfoProps) => {
  const appContext = useContext(AppContext);
  const isSelf = userId === appContext.userLoginInfo.userPid;

  const userInfoQuery = useGetUser(userId);

  const [newUserbio, setNewUserbio] = useState("");

  const username = userInfoQuery.data?.username;
  const userBio = userInfoQuery.data?.bio;

  const [editingUserbio, setEditingUserbio] = useState(false);
  const [editingUsername, setEditingUsername] = useState(false);

  const [newUsername, setNewUsername] = useState("");

  const setUserNameMutation = useSetUserName(userId, newUsername, () =>
    setEditingUsername(false)
  );
  const setUserBioMutation = useSetUserBio(userId, newUserbio, () =>
    setEditingUserbio(false)
  );

  const userNameEditorButton = (isSelf: boolean) => {
    if (setUserNameMutation.data?.error[0]) {
      return (
        <div>
          <p color="red">username exists. please choose another one</p>
          <button
            onClick={() => {
              setUserNameMutation.reset();
              setNewUsername("");
              setEditingUsername(true);
            }}
          >
            OK
          </button>
        </div>
      );
    } else if (setUserNameMutation.isLoading) {
      return <CircularProgress size={"2rem"} />;
    }

    if (editingUsername) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "0.5rem",
          }}
        >
          <StyledEditButton
            onClick={() => setUserNameMutation.mutate()}
            disabled={newUsername === "" || newUsername === username}
          >
            <AiOutlineCheck />
          </StyledEditButton>
          <StyledEditButton
            type="reset"
            onClick={() => {
              setEditingUsername(false);
              setNewUsername("");
            }}
          >
            <AiOutlineClose />
          </StyledEditButton>
        </div>
      );
    } else {
      return (
        <StyledEditButton
          disabled={!isSelf}
          onClick={() => {
            setEditingUsername(true);
            setNewUsername(username ?? "");
          }}
        >
          <AiOutlineEdit size="1.5rem" />
        </StyledEditButton>
      );
    }
  };

  const userNameBioButton = (isSelf: boolean) => {
    if (setUserBioMutation.data?.error[0]) {
      return <p color="red">Failed to update bio. Please try again</p>;
    } else if (setUserBioMutation.isLoading) {
      return <CircularProgress size={"2rem"} />;
    }

    if (editingUserbio) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "0.5rem",
          }}
        >
          <StyledEditButton
            onClick={() => setUserBioMutation.mutate()}
            disabled={newUserbio === "" || newUserbio === userBio}
          >
            <AiOutlineCheck />
          </StyledEditButton>
          <StyledEditButton
            type="reset"
            onClick={() => {
              setEditingUserbio(false);
              setNewUserbio("");
            }}
          >
            <AiOutlineClose />
          </StyledEditButton>
        </div>
      );
    } else {
      return (
        <StyledEditButton
          disabled={!isSelf}
          onClick={() => {
            setEditingUserbio(true);
            setNewUserbio(userBio ?? "");
          }}
        >
          <AiOutlineEdit size="1.5rem" />
        </StyledEditButton>
      );
    }
  };

  return (
    <Wrapper>
      <StyledEditor>
        <StyledLabel>Principal ID:</StyledLabel>
        {userId}
      </StyledEditor>
      <StyledEditor>
        <StyledLabel> User name: </StyledLabel>
        <StyledInput
          id="username"
          placeholder="Choose your username"
          readOnly={!editingUsername}
          value={editingUsername ? newUsername : username}
          onChange={(e: any) => setNewUsername(e.target.value)}
          isActive={editingUsername}
        />
        {isSelf &&
          (newUsername.length > 20 ? (
            <p style={{ color: "red" }}>Max username length is 20</p>
          ) : (
            userNameEditorButton(isSelf)
          ))}
      </StyledEditor>
      <StyledEditor>
        <StyledLabel>User bio: </StyledLabel>
        <StyledTextArea
          id="userbio"
          placeholder="Tell about yourself"
          readOnly={!editingUserbio}
          value={editingUserbio ? newUserbio : userBio}
          onChange={(e: any) => setNewUserbio(e.target.value)}
          rows={5}
          cols={40}
          maxLength={200}
          isActive={editingUserbio}
        ></StyledTextArea>
        {isSelf &&
          (newUserbio.length > 200 ? (
            <p style={{ color: "red" }}>Max bio length is 200</p>
          ) : (
            userNameBioButton(isSelf)
          ))}
      </StyledEditor>
    </Wrapper>
  );
};
