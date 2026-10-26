import { useMutation, useQueryClient } from "@tanstack/react-query";
import { draftPost } from "../api/post.api";
import { toast } from "sonner";
import { handleApiError } from "@/utils/errors/handleApiError";

export const useDraft = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: draftPost,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["current-user-posts"] });

      toast.success("Post has been drafted");
    },

    onError: handleApiError,
  });
};
