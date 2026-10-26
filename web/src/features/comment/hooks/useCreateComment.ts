import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createComment } from "../api/comment.api";
import type { CreateCommentBody } from "../schema";
import { toast } from "sonner";
import { handleApiError } from "@/utils/errors/handleApiError";

type Variables = {
  postId: string;
  body: CreateCommentBody;
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, body }: Variables) => createComment(postId, body),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["current-user-posts"] });
      queryClient.invalidateQueries({ queryKey: ["post-comments"] });

      toast.success("Comment added to post");
    },

    onError: handleApiError,
  });
};
