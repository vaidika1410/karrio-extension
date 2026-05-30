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

export async function getApplication(
  id: string,
) {
  const response = await api.get(
    `/applications/${id}`,
  );

  return response.data;
}


export async function getUpcomingInterviews() {
  const response =
    await api.get(
      "/applications/upcoming-interviews",
    );

  return response.data;
}

export async function getApplicationReminders(
  applicationId: string,
) {
  const response =
    await api.get(
      `/reminders/application/${applicationId}`,
    );

  return response.data;
}

export async function getPendingReminders() {
  const response =
    await api.get("/reminders");

  return response.data;
}