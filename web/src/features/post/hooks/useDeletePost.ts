import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePost } from "../api/post.api";
import { toast } from "sonner";
import { handleApiError } from "@/utils/errors/handleApiError";

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePost,

    onSuccess: (_, postId) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["current-user-posts"] });
      queryClient.invalidateQueries({ queryKey: ["current-user-liked-posts"] });
      queryClient.removeQueries({ queryKey: ["posts", postId] });

      toast.success("Your post has been successfully deleted");
    },

    onError: handleApiError,
  });
};
