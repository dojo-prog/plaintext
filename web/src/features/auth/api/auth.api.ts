import { api } from "@/lib/axios/client";
import type { FetchCurrentUserRes, LoginRes } from "../types/auth.types";
import type { LoginBody, RegisterBody } from "../schema";

export const fetchCurrentUser = async () => {
  const { data } = await api.get<FetchCurrentUserRes>("/user");

  return data.data;
};

export const register = async (body: RegisterBody): Promise<void> => {
  await api.post("/register", body);
};

export const login = async (body: LoginBody) => {
  const { data } = await api.post<LoginRes>("/login", body);

  return data.data;
};

export const logout = async (): Promise<void> => {
  await api.post("/logout");
};
