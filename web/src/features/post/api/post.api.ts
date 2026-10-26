import { api } from "@/lib/axios/client";
import type { CreatePostBody, PostQuery, UpdatePostBody } from "../schema";
import type {
  CreatePostRes,
  DraftPostRes,
  FetchPostRes,
  FetchPostsRes,
  PublishPostRes,
  UpdatePostRes,
  UploadPostImageRes,
} from "../types/post.types";

export const fetchPosts = async (params: PostQuery) => {
  const { data } = await api.get<FetchPostsRes>("/v1/posts", { params });

  return data;
};

export const fetchPost = async (postId: string) => {
  const { data } = await api.get<FetchPostRes>(`/v1/posts/${postId}`);

  return data.data;
};

export const fetchUserPosts = async (params: PostQuery) => {
  const { data } = await api.get<FetchPostsRes>("/v1/user/posts", { params });

  return data;
};

export const createPost = async (body: CreatePostBody) => {
  const { data } = await api.post<CreatePostRes>("/v1/posts", body);

  return data.data;
};

export const updatePost = async (postId: string, body: UpdatePostBody) => {
  const { data } = await api.patch<UpdatePostRes>(`/v1/posts/${postId}`, body);

  return data.data;
};

export const deletePost = async (postId: string): Promise<void> => {
  await api.delete(`/v1/posts/${postId}`);
};

export const publishPost = async (postId: string) => {
  const { data } = await api.patch<PublishPostRes>(
    `/v1/user/posts/${postId}/publish`,
  );

  return data.data;
};

export const draftPost = async (postId: string) => {
  const { data } = await api.patch<DraftPostRes>(
    `/v1/user/posts/${postId}/draft`
  );

  return data.data;
};

export const uploadPostImage = async (postId: string, image: File) => {
  const formData = new FormData();
  formData.append("image", image);

  const { data } = await api.post<UploadPostImageRes>(
    `/v1/posts/${postId}/image`,
    formData
  );

  return data.data;
};

export const deletePostImage = async (postId: string): Promise<void> => {
  await api.delete(`/v1/posts/${postId}/image`);
};
