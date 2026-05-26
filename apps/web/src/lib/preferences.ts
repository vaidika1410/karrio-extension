export const INTERVIEW_NOTIFICATIONS_KEY = "karrio_interview_notifications";

export function areInterviewNotificationsEnabled() {
  if (typeof window === "undefined") {
    return false;
  }

  return (
    localStorage.getItem(INTERVIEW_NOTIFICATIONS_KEY) === "true"
  );
}
