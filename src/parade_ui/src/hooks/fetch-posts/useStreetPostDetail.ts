import { useQuery } from "@tanstack/react-query";
import { Post, convertToPost } from "../../types/post";
import { useMainServerActor } from "../server-connect/useMainServerActor";

export const useStreetPostDetail = (postId: string, enabled: boolean) => {
  const server = useMainServerActor();

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
