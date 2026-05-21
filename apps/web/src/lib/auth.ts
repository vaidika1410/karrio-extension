export function getAccessToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(
    "accessToken",
  );
}

export function logout() {
  localStorage.removeItem("accessToken");

  window.location.href = "/login";
}