import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleLike } from "../api/like.api";
import { env } from "@/config/env";

export const useToggleLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleLike,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["current-user-liked-posts"] });
    },

    onError: (error) => {
      if (env.environment !== "production") {
        console.error(error);
      }
    },
  });
};
