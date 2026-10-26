import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleLike } from "../api/like.api";
import { toast } from "sonner";
import { handleApiError } from "@/utils/errors/handleApiError";

export const useToggleLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleLike,

    onSuccess: ({ liked }) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["current-user-liked-posts"] });

      if (liked) {
        toast.success("Post liked");
      } else {
        toast.success("Like removed from post");
      }
    },

    onError: handleApiError,
  });
};
