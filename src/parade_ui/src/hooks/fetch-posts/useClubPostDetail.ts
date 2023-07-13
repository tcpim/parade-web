import { useQuery } from "@tanstack/react-query";
import { Post, convertToPost } from "../../types/post";
import { getClubServer } from "../useClubServer";

export const useClubPostDetail = (
  postId: string,
  clubId: string,
  enabled: boolean
) => {
  const postDetailQuery = useQuery<Post, Error>({
    queryKey: ["clubPostDetail", postId],
    queryFn: async () => {
      const response = await getClubServer(clubId).get_post_by_id(postId);
      const post = response.post.length > 0 ? response.post[0] : undefined;
      if (post === undefined) {
        throw new Error("Post not found");
      }

      return convertToPost(post);
    },
    enabled: enabled,
  });

  return postDetailQuery;
};
