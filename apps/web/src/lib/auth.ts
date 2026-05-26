export interface StoredUser {
  id: string;
  email: string;
  name: string | null;
}

const TOKEN_KEY = "accessToken";
const USER_KEY = "karrio_user";

export function getAccessToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): StoredUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = localStorage.getItem(USER_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as StoredUser;
  } catch {
    return null;
  }
}

export function notifySessionChange() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event("karrio:session-changed"));
  window.postMessage({ type: "KARRIO_SESSION_CHANGED" }, window.origin);
}

export function setSession(accessToken: string, user: StoredUser) {
  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  notifySessionChange();
}

export function setStoredUser(user: StoredUser) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  notifySessionChange();
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  notifySessionChange();
  window.location.href = "/login";
}

export function isAuthenticated() {
  return Boolean(getAccessToken());
}
