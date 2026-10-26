import { ApiError } from "./ApiError";
import { toast } from "sonner";

export const handleApiError = (error: unknown) => {
  if (error instanceof ApiError) {
    toast.error(error.message);
    return;
  }

  if (error instanceof Error) {
    toast.error(error.message);
    return;
  }

  toast.error("Something went wrong. Please try again");
};
