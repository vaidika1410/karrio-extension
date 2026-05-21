import { api } from "@/lib/api";

export async function getApplications() {
  const response = await api.get(
    "/applications",
  );

  return response.data;
}

export async function deleteApplication(
  id: string,
) {
  const response = await api.delete(
    `/applications/${id}`,
  );

  return response.data;
}

export async function updateApplication(
  id: string,
  data: any,
) {
  const response = await api.patch(
    `/applications/${id}`,
    data,
  );

  return response.data;
}