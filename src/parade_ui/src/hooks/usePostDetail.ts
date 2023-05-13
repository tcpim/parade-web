import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { useMainServer } from "./useMainServer";
import {
    GetPostByIdResponse,
} from "../../backend_declarations/main_server/main_server.did";

export const usePostDetail = (postId: string) => {
    const mainServer = useMainServer();
    const {isLoading, isSuccess, isError, data} = useQuery<GetPostByIdResponse, Error>(
        {
            queryKey: ["postDetail", postId],
            queryFn: async () => {
                const response = await mainServer.get_post_by_id(postId);
                return response;
            },
        }
    );

    return {isLoading, isSuccess, isError, data}
}