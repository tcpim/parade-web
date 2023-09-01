import { useContext } from "react";
import {
  HiOutlineGlobeAlt,
  HiOutlineInformationCircle,
  HiOutlinePlus,
  HiOutlineUser,
  HiOutlineUserGroup,
} from "react-icons/hi";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { AppContext } from "../../App";
import { Icon } from "./TopSideBarLayout";

const Wrapper = styled.ol`
  padding-top: 8rem;
  padding-inline-start: 0;
`;

interface ListItemProps {
  textBold: boolean;
}
const ListItem = styled.li<ListItemProps>`
  list-style: none;
  margin-left: 1rem;
  margin-bottom: 1rem;
  margin-right: 4rem;
  padding-left: 1rem;
  font-size: 1.5rem;
  display: grid;
  grid-template-columns: 4rem 1fr;
  align-items: center;

  height: 4rem;
  border-radius: 2rem;

  font-weight: ${(props) => (props.textBold ? "bold" : "normal")};

  &:hover {
    background-color: rgba(214, 213, 214, 0.5);
  }
`;

interface NavBarProps {
  className?: string;
}

export const NavBar = ({ className }: NavBarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const appContext = useContext(AppContext);
  const currentPath = location.pathname;

  return (
    <Wrapper className={className}>
      <ListItem onClick={() => navigate("/")} textBold={currentPath === "/"}>
        <Icon as={HiOutlineUserGroup} size={2} bold={currentPath === "/"} />
        Clubs
      </ListItem>
      <ListItem
        onClick={() => navigate("/street")}
        textBold={currentPath === "/street"}
      >
        <Icon
          as={HiOutlineGlobeAlt}
          size={2}
          bold={currentPath === "/street"}
        />
        Street
      </ListItem>
      <ListItem
        onClick={() => navigate("/post-creator")}
        textBold={currentPath === "/post-creator"}
      >
        <Icon
          as={HiOutlinePlus}
          size={2}
          bold={currentPath === "/post-creator"}
        />
        Create
      </ListItem>
      <ListItem
        onClick={() => navigate("/profile")}
        textBold={currentPath === "/profile"}
      >
        <Icon as={HiOutlineUser} size={2} bold={currentPath === "/profile"} />
        Profile
      </ListItem>
      <ListItem
        onClick={() => navigate("/about")}
        textBold={currentPath === "/about"}
      >
        <Icon
          as={HiOutlineInformationCircle}
          size={2}
          bold={currentPath === "/about"}
        />
        About
      </ListItem>
    </Wrapper>
  );
};
