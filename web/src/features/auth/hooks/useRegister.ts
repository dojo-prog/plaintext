import { useMutation } from "@tanstack/react-query";
import { register } from "../api/auth.api";
import { toast } from "sonner";
import { handleApiError } from "@/utils/errors/handleApiError";

export const useRegister = () => {
  return useMutation({
    mutationFn: register,

    onSuccess: () => {
      toast.success("Registration successful");
    },

    onError: handleApiError,
  });
};
