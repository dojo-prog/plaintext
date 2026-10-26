import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePostImage } from "../api/post.api";
import { toast } from "sonner";
import { handleApiError } from "@/utils/errors/handleApiError";

export const useDeletePostImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePostImage,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["current-user-posts"] });

      toast.success("Post image has been removed");
    },

    onError: handleApiError,
  });
};
