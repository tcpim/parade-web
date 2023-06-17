import { useQuery } from "@tanstack/react-query";
import { GetPostByIdResponse } from "../../../backend_declarations/main_server/main_server.did";
import { useMainServer } from "../useMainServer";

export const useStreetPostDetail = (postId: string) => {
  const server = useMainServer();

  const postDetailQuery = useQuery<GetPostByIdResponse, Error>({
    queryKey: ["postDetail", postId],
    queryFn: async () => {
      const response = await server.get_street_post_by_id(postId);
      return response;
    },
  });

  return postDetailQuery;
};
