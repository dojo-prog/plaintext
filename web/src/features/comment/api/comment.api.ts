import { api } from "@/lib/axios/client";
import {
  type CreateCommentRes,
  type FetchPostCommentsRes,
  type UpdateCommentRes,
} from "../types/comment.types";
import type { CreateCommentBody, UpdateCommentBody } from "../schema";

export const fetchPostComments = async (postId: string, page: number) => {
  const { data } = await api.get<FetchPostCommentsRes>(
    `/v1/posts/${postId}/comments`,
    { params: { page } },
  );

  return data;
};

export const createComment = async (
  postId: string,
  body: CreateCommentBody,
) => {
  const { data } = await api.post<CreateCommentRes>(
    `/v1/posts/${postId}/comments`,
    body,
  );

  return data.data;
};

export const updateComment = async (
  commentId: string,
  body: UpdateCommentBody,
) => {
  const { data } = await api.patch<UpdateCommentRes>(
    `/v1/comments/${commentId}`,
    body,
  );

  return data.data;
};

export const deleteComment = async (commentId: string): Promise<void> => {
  await api.delete<UpdateCommentRes>(`/v1/comments/${commentId}`);
};
