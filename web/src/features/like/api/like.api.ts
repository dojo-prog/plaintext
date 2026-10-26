import { api } from "@/lib/axios/client";
import {
  type FetchUserLikedPostRes,
  type ToggleLikeRes,
} from "../types/like.types";

export const fetchUserLikedPosts = async (page: number) => {
  const { data } = await api.get<FetchUserLikedPostRes>("/v1/likes", {
    params: { page },
  });

  return data;
};

export const toggleLike = async (postId: string) => {
  const { data } = await api.post<ToggleLikeRes>(`/v1/posts/${postId}/like`);

  return data;
};
