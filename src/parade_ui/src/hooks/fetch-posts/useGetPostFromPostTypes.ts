import { ActorSubclass } from "@dfinity/agent";
import { QueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import {
  _SERVICE as ClubServerInterface,
  GetPostByIdsResponse,
} from "../../../backend_declarations/club_server/ludo_arts_club.did";
import { PostType } from "../../../backend_declarations/main_server/main_server.did";
import { Post, convertToPost } from "../../types/post";
import { useClubServerActorQueryMap } from "../server-connect/useClubServerActor";

/**
 * Returns a callback that fetches posts from club server and marge with street posts
 */
export function useGetPostFromPostTypes(): (
  pageSize: number,
  posts: Array<PostType>
) => Promise<Post[]> {
  const actorMap: Map<
    string,
    ActorSubclass<ClubServerInterface>
  > = useClubServerActorQueryMap();

  const helper = useCallback(
    async (pageSize: number, posts: Array<PostType>): Promise<Post[]> => {
      const queryClient = new QueryClient();
      const postArray: (Post | undefined)[] = Array(pageSize);
      const clubPostIdMap: Map<string, [number, string][]> = new Map<
        string,
        [number, string][]
      >();

      posts.forEach((post, index) => {
        if (post.club_post.length > 0) {
          // If club post, construct map and call getClubPostsByIds later
          const clubId = post.club_post[0]?.club_id ?? "";
          const postIds = clubPostIdMap.get(clubId) ?? [];
          postIds.push([index, post.club_post[0]?.post_id ?? ""]);
          clubPostIdMap.set(clubId, postIds);
        } else if (post.post.length > 0) {
          // If street post, add it to the post array
          postArray[index] =
            post.post[0] === undefined
              ? undefined
              : convertToPost(post.post[0]);
        }
      });

      // Fetch club posts by IDs and add them to the post array in the correct index
      const fetchClubPostsPromises = Array.from(clubPostIdMap).map(
        async ([clubId, postIds]) => {
          const clubPostsRes: GetPostByIdsResponse =
            await queryClient.fetchQuery({
              queryKey: ["clubPostsByIds", clubId, postIds],
              queryFn: () => {
                const clubServer = actorMap.get(clubId);
                if (clubServer === undefined) {
                  throw new Error("Club server is undefined");
                }
                return clubServer.get_post_by_ids(postIds.map((i) => i[1]));
              },
            });

          postIds.forEach((i: [number, string], idx) => {
            const p = clubPostsRes.posts[idx][0];
            postArray[i[0]] = p === undefined ? undefined : convertToPost(p);
          });
        }
      );

      // Wait for all promises to resolve
      await Promise.all(fetchClubPostsPromises);

      return postArray.filter((post) => post !== undefined) as Post[];
    },
    [actorMap]
  );
  return helper;
}
