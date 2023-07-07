import {
  HiOutlineGlobeAlt,
  HiOutlinePlus,
  HiOutlineUser,
  HiOutlineUserGroup,
} from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Icon } from "./TopSideBarLayout";

const Wrapper = styled.ol`
  padding-top: 8rem;
  padding-inline-start: 0;
`;

const ListItem = styled.li`
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

  &:hover {
    background-color: rgba(214, 213, 214, 0.5);
  }
`;

interface NavBarProps {
  className?: string;
}

export const NavBar = ({ className }: NavBarProps) => {
  const navigate = useNavigate();

  return (
    <Wrapper className={className}>
      <ListItem onClick={() => navigate("/clubs")}>
        <Icon as={HiOutlineUserGroup} size={2} />
        Clubs
      </ListItem>
      <ListItem onClick={() => navigate("/")}>
        <Icon as={HiOutlineGlobeAlt} size={2} />
        Street
      </ListItem>
      <ListItem onClick={() => navigate("/post-creator")}>
        <Icon as={HiOutlinePlus} size={2} />
        Create
      </ListItem>
      <ListItem onClick={() => navigate("/profile")}>
        <Icon as={HiOutlineUser} size={2} />
        Profile
      </ListItem>
    </Wrapper>
  );
};
