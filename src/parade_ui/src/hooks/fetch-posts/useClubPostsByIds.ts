import { useQuery } from "@tanstack/react-query";
import { GetPostByIdsResponse } from "../../../backend_declarations/club_server/ludo_arts_club.did";
import { getClubServer } from "../useClubServer";

export const useClubPostsByIds = (
  postIds: Array<string>,
  clubId: string,
  enabled = true
) => {
  const clubPostsQuery = useQuery<GetPostByIdsResponse, Error>({
    queryKey: ["clubPostsByIds", clubId, postIds],
    queryFn: () => {
      return getClubServer(clubId).get_post_by_ids(postIds);
    },
    enabled: enabled,
  });

  return clubPostsQuery;
};
