import { useQuery } from "@tanstack/react-query";
import { Post, convertToPost } from "../../types/post";
import { useClubServerActorQuery } from "../server-connect/useClubServerActor";

export const useClubPostDetail = (
  postId: string,
  clubId: string,
  enabled: boolean
) => {
  const clubServer = useClubServerActorQuery(clubId);

  const postDetailQuery = useQuery<Post, Error>({
    queryKey: ["clubPostDetail", postId],
    queryFn: async () => {
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
