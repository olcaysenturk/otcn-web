import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { refreshUser } from "@/services/auth";
import type { LoginResponse } from "@/types/auth";
import { clearServerSessionCookies } from "@/lib/auth/sessionCookies";

const API_BASE = process.env.API_BASE_URL!;

type FetchOpts = Omit<RequestInit, "headers"> & {
  headers?: Record<string, string>;
};

export async function serverFetch(path: string, opts: FetchOpts = {}) {
  return serverFetchWithRetry(path, opts, false);
}

async function serverFetchWithRetry(
  path: string,
  opts: FetchOpts,
  hasRetried: boolean,
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  const method = (opts.method ?? "GET").toUpperCase();
  const headers = {
    ...(opts.headers ?? {}),
  } as Record<string, string>;
  if (
    !headers["Content-Type"] &&
    opts.body != null &&
    method !== "GET" &&
    method !== "HEAD"
  ) {
    headers["Content-Type"] = "application/json";
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const accountIdsRaw = cookieStore.get("account_ids")?.value;
  if (accountIdsRaw) {
    try {
      const parsed = JSON.parse(accountIdsRaw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        headers.AccountId = String(parsed[0]);
      }
    } catch {
      // Ignore parse errors
    }
  }

  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
  const res = await fetch(url, {
    ...opts,
    headers,
    cache: "no-store",
  });

  if (res.status === 401 && !hasRetried) {
    const refreshed = await tryRefresh(cookieStore);
    if (refreshed) {
      return serverFetchWithRetry(path, opts, true);
    }
    redirect("/en/auth/login");
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }

  const contentType = res.headers.get("content-type") || "";
  // If it's JSON or if the user explicitly asked for JSON, try to parse it.
  // Otherwise, return the raw response object to allow the caller to decide (like clientFetch).
  if (contentType.includes("application/json")) {
    return res.json();
  }

  return res;
}

async function tryRefresh(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  const refreshToken = cookieStore.get("refresh_token")?.value;
  if (!refreshToken) return false;

  try {
    const res = await refreshUser({ refreshToken });
    if (!res.ok) {
      clearServerSessionCookies(cookieStore);
      return false;
    }

    const data = (await res.json().catch(() => null)) as LoginResponse | null;
    if (!data?.accessToken || !data?.refreshToken) {
      clearServerSessionCookies(cookieStore);
      return false;
    }

    const isProd = process.env.NODE_ENV === "production";
    // Use ONLY expiresInAsMinutes from BE.
    const maxAgeSeconds = data.expiresInAsMinutes ? data.expiresInAsMinutes * 60 : undefined;
    const expiresAt = maxAgeSeconds ? new Date(Date.now() + maxAgeSeconds * 1000) : undefined;

    const cookieOptions = {
      path: "/",
      secure: isProd,
      sameSite: "lax" as const,
      ...(maxAgeSeconds ? { maxAge: maxAgeSeconds } : {}),
    } as any;

    cookieStore.set("access_token", data.accessToken, { ...cookieOptions, httpOnly: true });
    cookieStore.set("refresh_token", data.refreshToken, { ...cookieOptions, httpOnly: true });

    if (expiresAt) {
      cookieStore.set("access_expires_at", expiresAt.toISOString(), cookieOptions);
    }

    if (data.accountIds?.length) {
      cookieStore.set("account_ids", JSON.stringify(data.accountIds), cookieOptions);
    }

    return true;
  } catch {
    clearServerSessionCookies(cookieStore);
    return false;
  }
}
