import { useQuery } from "@tanstack/react-query";
import { GetPostByIdResponse } from "../../../backend_declarations/club_server/ludo_arts_club.did";
import { getClubServer } from "../useClubServer";

export const useClubPostDetail = (
  postId: string,
  clubId: string,
  enabled: boolean
) => {
  const postDetailQuery = useQuery<GetPostByIdResponse, Error>({
    queryKey: ["clubPostDetail", postId],
    queryFn: async () => {
      const response = await getClubServer(clubId).get_post_by_id(postId);
      return response;
    },
    enabled: enabled,
  });

  return postDetailQuery;
};
