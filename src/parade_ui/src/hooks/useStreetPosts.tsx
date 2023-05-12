import { useQuery } from "@tanstack/react-query";
import { useMainServer } from "./useMainServer";
import {
  GetStreetPostsRequest,
  GetStreetPostsResponse,
} from "../../backend_declarations/main_server/main_server.did";

export interface GetStreetPostsProps {
  offset: number;
  limit: number;
}

export const useStreetPosts = (props: GetStreetPostsProps) => {
  const mainServer = useMainServer();
  const request: GetStreetPostsRequest = {
    offset: props.offset,
    limit: [props.limit],
  };

  const { data, error, isLoading, isSuccess, isError } = useQuery<
    GetStreetPostsResponse,
    Error
  >(
    ["getStreetPosts", request],
    async () => await mainServer.get_street_posts(request)
  );

  return { data, error, isLoading, isSuccess, isError };
};
