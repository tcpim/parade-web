import { useContext } from "react";
import { MdOutlineExplore } from "react-icons/md";
import { SocialIcon } from "react-social-icons";
import { styled } from "styled-components";
import { AppContext } from "../../App";
import { useUserBelongToClub } from "../../hooks/user/useUserBelongToClub";
import { ClubInfo, clubs } from "../../utils/clubInfos";
import { truncateStr } from "../../utils/strings";

const Wrapper = styled.div`
  padding: 1rem;
`;

const Content = styled.div`
  position: sticky;
  top: 8rem;
`;

const Icons = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const IconButton = styled.div`
  display: flex;
  align-items: center;
  &:hover {
    cursor: pointer;
  }
`;

const CollectionRow = styled.div`
  display: grid;
  grid-template-columns: 10rem 5rem;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

interface ClubSidebarProps {
  clubId: string;
}

export const ClubSidebar = ({ clubId }: ClubSidebarProps) => {
  const clubInfo: ClubInfo = clubs[clubId];
  const appContext = useContext(AppContext);
  const belong = useUserBelongToClub(
    appContext.userLoginInfo.userAccount,
    clubId ?? ""
  );

  if (clubInfo === undefined) {
    return <p>unknown club</p>;
  }

  const icon = (icon: any, link: string) => {
    return <IconButton onClick={() => window.open(link)}>{icon}</IconButton>;
  };

  const collectionList = () => {
    return (
      <div>
        {clubInfo.collections.map((collection) => {
          return (
            <CollectionRow>
              <p>{truncateStr(collection.name, 15)}</p>
              <button onClick={() => window.open(collection.tradeUrl)}>
                Trade
              </button>
            </CollectionRow>
          );
        })}
      </div>
    );
  };

  return (
    <Wrapper>
      <Content>
        {!belong && <i>You are in readonly mode in this club</i>}
        <h3 style={{ fontSize: "2rem" }}>{clubInfo.name} Club</h3>
        <Icons>
          {clubInfo.twitter !== "" &&
            icon(
              <SocialIcon
                network="twitter"
                style={{ height: 25, width: 25 }}
              />,
              clubInfo.twitter
            )}
          {clubInfo.discord !== "" &&
            icon(
              <SocialIcon
                network="discord"
                style={{ height: 25, width: 25 }}
              />,
              clubInfo.discord
            )}
          {clubInfo.website !== "" &&
            icon(
              <MdOutlineExplore style={{ height: 25, width: 25 }} />,
              clubInfo.website
            )}
        </Icons>
        {collectionList()}
      </Content>
    </Wrapper>
  );
};
