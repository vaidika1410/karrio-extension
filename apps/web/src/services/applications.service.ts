import { api } from "@/lib/api";

export async function getApplications() {
  const response = await api.get(
    "/applications",
  );

  return response.data;
}