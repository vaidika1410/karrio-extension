import { api } from "@/lib/api";
import type { StoredUser } from "@/lib/auth";

export interface UserProfile extends StoredUser {
  createdAt: string;
}

export async function getProfile(): Promise<UserProfile> {
  const response = await api.get<UserProfile>("/users/me");
  return response.data;
}

export async function updateProfile(data: {
  name?: string;
}): Promise<UserProfile> {
  const response = await api.patch<UserProfile>("/users/me", data);
  return response.data;
}
