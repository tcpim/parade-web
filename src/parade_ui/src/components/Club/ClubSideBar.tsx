import { AiOutlineTwitter } from "react-icons/ai";
import { BiLogoDiscord } from "react-icons/bi";
import { MdOutlineExplore } from "react-icons/md";
import { styled } from "styled-components";
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
  &:hover {
    cursor: pointer;
  }
`;

const CollectionRow = styled.div`
  display: grid;
  grid-template-columns: 10rem 5rem;
  justify-content: space-around;
  margin-bottom: 0.5rem;
`;

interface ClubSidebarProps {
  clubId: string;
}

export const ClubSidebar = ({ clubId }: ClubSidebarProps) => {
  const clubInfo: ClubInfo = clubs[clubId];

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
        <h3 style={{ fontSize: "2rem" }}>{clubInfo.name} Club</h3>
        <Icons>
          {clubInfo.twitter !== "" &&
            icon(<AiOutlineTwitter size={"2rem"} />, clubInfo.twitter)}
          {clubInfo.discord !== "" &&
            icon(<BiLogoDiscord size={"2rem"} />, clubInfo.discord)}
          {clubInfo.website !== "" &&
            icon(<MdOutlineExplore size={"2rem"} />, clubInfo.website)}
        </Icons>
        {collectionList()}
      </Content>
    </Wrapper>
  );
};
