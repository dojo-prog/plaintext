import axios from "axios";
import { api } from "./client";
import { ApiError } from "@/utils/errors/ApiError";

api.interceptors.response.use(
  (res) => res,

  (error) => {
    if (!axios.isAxiosError(error)) {
      return Promise.reject(error);
    }

    const response = error.response;

    return Promise.reject(
      new ApiError(
        response?.data?.message ?? "Something went wrong",
        response?.status,
        response?.data?.code,
        response?.data,
      ),
    );
  },
);

api.interceptors.request.use(
  (config) => {
    const auth_token = localStorage.getItem("plaintext_auth_token");

    if (auth_token) {
      config.headers.Authorization = `Bearer ${auth_token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
