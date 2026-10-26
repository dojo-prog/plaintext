import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../api/auth.api";
import { toast } from "sonner";
import { env } from "@/config/env";

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,

    onSuccess: () => {
      queryClient.clear();

      localStorage.removeItem(env.authTokenName);

      toast.success("Logout successful");
    },
  });
};
