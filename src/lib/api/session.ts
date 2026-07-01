export type ClientSession = {
  authenticated?: boolean;
  accessToken?: string | null;
  accountIds?: number[];
};

const SESSION_TTL_MS = 10_000;
const sessionCache = {
  value: null as ClientSession | null,
  fetchedAt: 0,
  inFlight: null as Promise<ClientSession | null> | null,
};

export async function getSession(): Promise<ClientSession | null> {
  const now = Date.now();
  if (sessionCache.value !== null && now - sessionCache.fetchedAt < SESSION_TTL_MS) {
    return sessionCache.value;
  }

  if (sessionCache.inFlight) return sessionCache.inFlight;

  sessionCache.inFlight = (async () => {
    try {
      const res = await fetch("/api/auth/session", { cache: "no-store" });
      if (!res.ok) return null;
      const data = (await res.json().catch(() => null)) as ClientSession | null;
      return data;
    } catch {
      return null;
    }
  })();

  try {
    const session = await sessionCache.inFlight;
    sessionCache.value = session;
    sessionCache.fetchedAt = Date.now();
    return session;
  } finally {
    sessionCache.inFlight = null;
  }
}

export function invalidateSession() {
  sessionCache.value = null;
  sessionCache.fetchedAt = 0;
  sessionCache.inFlight = null;
}

export async function refreshSession() {
  const res = await fetch("/api/auth/refresh", { method: "POST" });
  invalidateSession();
  const session = await getSession();

  if (!session?.authenticated && typeof window !== "undefined") {
    window.location.href = "/en/auth/login";
  }

  return session;
}
