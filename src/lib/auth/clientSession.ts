export type ClientAuthSession = {
  email: string;
  loginAt: string;
};

const SESSION_KEY = "auth-session";

export function readAuthSession(): ClientAuthSession | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ClientAuthSession;
  } catch {
    return null;
  }
}

export function writeAuthSession(session: ClientAuthSession) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearAuthSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SESSION_KEY);
  window.localStorage.removeItem("auth-verified");
}

export function clearLoginSessionData() {
  if (typeof window === "undefined") return;
  const keys = [
    "user-login-flow-id",
    "user-email",
    "user-phone",
    "user-remember",
    "is-email-required",
    "is-phone-required",
  ];
  keys.forEach((key) => sessionStorage.removeItem(key));
}
