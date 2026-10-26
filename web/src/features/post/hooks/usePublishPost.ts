import { useMutation, useQueryClient } from "@tanstack/react-query";
import { publishPost } from "../api/post.api";
import { toast } from "sonner";
import { handleApiError } from "@/utils/errors/handleApiError";

export const usePublish = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: publishPost,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["current-user-posts"] });

      toast.success("Post has been published");
    },

    onError: handleApiError,
  });
};
