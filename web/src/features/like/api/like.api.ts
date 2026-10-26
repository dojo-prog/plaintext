import { api } from "@/lib/axios/client";
import { type FetchUserLikedPostRes } from "../types/like.types";

export const fetchUserLikedPosts = async (page: number) => {
  const { data } = await api.get<FetchUserLikedPostRes>("/v1/likes", {
    params: { page },
  });

  return data;
};

export const toggleLike = async (postId: string): Promise<void> => {
  await api.post(`/posts/${postId}/like`);
};
