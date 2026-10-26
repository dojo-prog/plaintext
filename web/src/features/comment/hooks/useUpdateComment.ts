import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateCommentBody } from "../schema";
import { updateComment } from "../api/comment.api";
import { toast } from "sonner";
import { handleApiError } from "@/utils/errors/handleApiError";

type Variables = {
  commentId: string;
  body: UpdateCommentBody;
};

export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, body }: Variables) =>
      updateComment(commentId, body),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["current-user-posts"] });
      queryClient.invalidateQueries({ queryKey: ["post-comments"] });

      toast.success("Comment updated");
    },

    onError: handleApiError,
  });
};
