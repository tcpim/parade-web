import { useQuery } from "@tanstack/react-query";
import { Post, convertToPost } from "../../types/post";
import { getClubServer } from "../server-connect/useClubServer";

export const useClubPostDetail = (
  postId: string,
  clubId: string,
  enabled: boolean
) => {
  const postDetailQuery = useQuery<Post, Error>({
    queryKey: ["clubPostDetail", postId],
    queryFn: async () => {
      const clubServer = getClubServer(clubId);
      if (clubServer === undefined) {
        throw new Error("Club server is undefined");
      }

      const response = await clubServer.get_post_by_id(postId);
      const post = response.post.length > 0 ? response.post[0] : undefined;
      if (post === undefined) {
        throw new Error("Post not found");
      }

      return convertToPost(post);
    },
    enabled: enabled,
    staleTime: 30 * 1000, // 30 seconds
  });

  return postDetailQuery;
};
