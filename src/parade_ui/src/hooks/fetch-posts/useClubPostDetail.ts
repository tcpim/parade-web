import { useQuery } from "@tanstack/react-query";
import { useErrorBoundary } from "react-error-boundary";
import { Post, convertToPost } from "../../types/post";
import { getClubServer } from "../useClubServer";

export const useClubPostDetail = (
  postId: string,
  clubId: string,
  enabled: boolean
) => {
  const { showBoundary } = useErrorBoundary();
  const postDetailQuery = useQuery<Post, Error>({
    queryKey: ["clubPostDetail", postId],
    queryFn: async () => {
      const response = await getClubServer(clubId).get_post_by_id(postId);
      const post = response.post.length > 0 ? response.post[0] : undefined;
      if (post === undefined) {
        showBoundary(new Error("Post not found"));
      }

      return convertToPost(post);
    },
    enabled: enabled,
  });

  return postDetailQuery;
};
