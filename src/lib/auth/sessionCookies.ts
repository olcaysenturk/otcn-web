import { NextResponse } from "next/server";
import type { LoginResponse } from "@/types/auth";

type CookieStore = {
    set: (name: string, value: string, options: { path: string; expires: Date }) => void;
};

/**
 * Sets session cookies (access_token, refresh_token, access_expires_at, account_ids)
 * based on the LoginResponse data.
 * 
 * @param response The NextResponse object to set cookies on
 * @param data The LoginResponse data containing tokens and expiration
 */
export function setSessionCookies(
    response: NextResponse,
    data: LoginResponse,
    options?: { remember?: boolean }
) {
    const isProd = process.env.NODE_ENV === "production";
    const remember = options?.remember ?? true;

    // Persist cookies only when "remember me" is enabled.
    // Otherwise they stay as browser-session cookies (no maxAge).
    const maxAgeSeconds =
        remember && data.expiresInAsMinutes ? data.expiresInAsMinutes * 60 : undefined;

    const expiresAt = maxAgeSeconds
        ? new Date(Date.now() + maxAgeSeconds * 1000)
        : undefined;

    const cookieOptions = {
        path: "/",
        secure: isProd,
        sameSite: "lax" as const,
        ...(maxAgeSeconds ? { maxAge: maxAgeSeconds } : {}),
    };

    if (data.accessToken) {
        response.cookies.set("access_token", data.accessToken, {
            ...cookieOptions,
            httpOnly: true,
        });
    }

    if (data.refreshToken) {
        response.cookies.set("refresh_token", data.refreshToken, {
            ...cookieOptions,
            httpOnly: true,
        });
    }

    if (expiresAt) {
        response.cookies.set("access_expires_at", expiresAt.toISOString(), cookieOptions);
    }
    if (data.accountIds?.length) {
        response.cookies.set("account_ids", JSON.stringify(data.accountIds), cookieOptions);
    }
    response.cookies.set("remember_me", String(remember), cookieOptions);

    return response;
}

/**
 * Clears all session cookies.
 * 
 * @param response The NextResponse object to clear cookies from
 */
export function clearSessionCookies(response: NextResponse) {
    const expired = new Date(0);
    const options = { path: "/", expires: expired };

    response.cookies.set("access_token", "", options);
    response.cookies.set("refresh_token", "", options);
    response.cookies.set("access_expires_at", "", options);
    response.cookies.set("account_ids", "", options);
    response.cookies.set("remember_me", "", options);

    return response;
}

/**
 * Clears all session cookies using a server-side cookie store.
 * 
 * @param cookieStore The cookie store from next/headers
 */
export function clearServerSessionCookies(cookieStore: CookieStore) {
    const expired = new Date(0);
    const options = { path: "/", expires: expired };

    cookieStore.set("access_token", "", options);
    cookieStore.set("refresh_token", "", options);
    cookieStore.set("access_expires_at", "", options);
    cookieStore.set("account_ids", "", options);
    cookieStore.set("remember_me", "", options);
}
