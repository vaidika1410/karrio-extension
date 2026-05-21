import { api } from "@/lib/api";

export interface SignupData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export async function signup(data: SignupData) {
  const response = await api.post(
    "/auth/signup",
    data,
  );

  return response.data;
}

export async function login(data: LoginData) {
  const response = await api.post(
    "/auth/login",
    data,
  );

  return response.data;
}