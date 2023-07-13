import { useQuery } from "@tanstack/react-query";
import { Post, convertToPost } from "../../types/post";
import { useMainServer } from "../useMainServer";

export const useStreetPostDetail = (postId: string, enabled: boolean) => {
  const server = useMainServer();

  const postDetailQuery = useQuery<Post, Error>({
    queryKey: ["postDetail", postId],
    queryFn: async () => {
      const response = await server.get_street_post_by_id(postId);
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
