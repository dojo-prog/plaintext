import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "../api/post.api";
import { toast } from "sonner";
import { handleApiError } from "@/utils/errors/handleApiError";

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPost,

    onSuccess: (post) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["current-user-posts"] });

      const { status } = post;

      const message = {
        published: "Post published successfully",
        draft: "Post has been saved to draft",
      };

      toast.success(message[status]);
    },

    onError: handleApiError,
  });
};
