import * as Tooltip from "@radix-ui/react-tooltip";
import {
  HiOutlineGlobeAlt,
  HiOutlinePlus,
  HiOutlineUserGroup,
} from "react-icons/hi";

import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import logo from "../../../assets/logo.png";
import { Icon } from "./TopSideBar";
import WalletConnection from "./WalletConnection";

interface TopBarProps {
  className?: string;
}

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 8rem 1fr 8rem;
  align-items: center;
  justify-items: center;
  margin: 0 1rem;
`;

const Login = styled.div``;

const TopBarIcons = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 400px;
  margin-left: 3rem;
`;

interface IconButtonProps {
  children: React.ReactNode;
  className?: string;
  tooltipText: string;
  onClick?: () => void;
}

const TooltipWrapper = ({
  children,
  className,
  tooltipText,
  onClick,
}: IconButtonProps) => {
  return (
    <div className={className} onClick={onClick}>
      <Tooltip.Provider delayDuration={200}>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
          <Tooltip.Content side="bottom" sideOffset={16}>
            {tooltipText}
          </Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>
    </div>
  );
};

const IconButton = styled.div`
  &:hover {
    background-color: rgba(213, 213, 214, 0.5);
  }

  padding: 0.5rem 2rem;
  border-radius: 0.5rem;
`;

const Logo = styled.img`
  width: 50px;
  height: 50px;
  object-fit: contain;
`;

export const TopBar = ({ className }: TopBarProps) => {
  const navigate = useNavigate();

  return (
    <Wrapper className={className}>
      <Logo src={logo} onClick={() => navigate("/")}></Logo>
      <TopBarIcons>
        <TooltipWrapper onClick={() => navigate("/clubs")} tooltipText="Clubs">
          <IconButton>
            <Icon as={HiOutlineUserGroup} size={1.5} />
          </IconButton>
        </TooltipWrapper>
        <TooltipWrapper onClick={() => navigate("/")} tooltipText="Street">
          <IconButton>
            <Icon as={HiOutlineGlobeAlt} size={1.5} />
          </IconButton>
        </TooltipWrapper>
        <TooltipWrapper
          onClick={() => navigate("/post-creator")}
          tooltipText="Create"
        >
          <IconButton>
            <Icon as={HiOutlinePlus} size={1.5} />
          </IconButton>
        </TooltipWrapper>
      </TopBarIcons>
      <Login>
        <WalletConnection />
      </Login>
    </Wrapper>
  );
};
