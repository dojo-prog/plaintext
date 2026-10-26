import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdatePostBody } from "../schema";
import { updatePost } from "../api/post.api";
import { toast } from "sonner";
import { handleApiError } from "@/utils/errors/handleApiError";

type Variables = {
  postId: string;
  body: UpdatePostBody;
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, body }: Variables) => updatePost(postId, body),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["current-user-posts"] });

      toast.success("Your post has been successfully updated");
    },

    onError: handleApiError,
  });
};
