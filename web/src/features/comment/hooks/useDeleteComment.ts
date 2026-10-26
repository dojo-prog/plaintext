import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteComment } from "../api/comment.api";
import { toast } from "sonner";
import { handleApiError } from "@/utils/errors/handleApiError";

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteComment,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["current-user-posts"] });
      queryClient.invalidateQueries({ queryKey: ["post-comments"] });

      toast.success("Comment deleted");
    },

    onError: handleApiError,
  });
};
