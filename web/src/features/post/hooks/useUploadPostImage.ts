import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadPostImage } from "../api/post.api";
import { toast } from "sonner";
import { handleApiError } from "@/utils/errors/handleApiError";

type Variables = {
  postId: string;
  image: File;
};

export const useUploadPostImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, image }: Variables) => uploadPostImage(postId, image),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["current-user-posts"] });

      toast.success("Post image has been uploaded");
    },

    onError: handleApiError,
  });
};
