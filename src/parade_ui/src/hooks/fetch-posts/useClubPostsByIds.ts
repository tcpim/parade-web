import { useQuery } from "@tanstack/react-query";
import { GetPostByIdsResponse } from "../../../backend_declarations/club_server/ludo_arts_club.did";
import { useClubServer } from "../useClubServer";

export const useClubPostsByIds = (
  postIds: Array<string>,
  clubId: string,
  enabled = true
) => {
  const server = useClubServer(clubId);

  const clubPostsQuery = useQuery<GetPostByIdsResponse, Error>({
    queryKey: ["clubPostsByIds", clubId, postIds],
    queryFn: () => {
      return server.get_post_by_ids(postIds);
    },
    enabled: enabled,
  });

  return clubPostsQuery;
};
