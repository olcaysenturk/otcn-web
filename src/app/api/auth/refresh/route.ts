import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { refreshUser } from "@/services/auth";
import type { LoginResponse } from "@/types/auth";
import { setSessionCookies, clearServerSessionCookies } from "@/lib/auth/sessionCookies";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;
  const rememberCookie = cookieStore.get("remember_me")?.value;
  const remember = rememberCookie ? rememberCookie === "true" : true;

  if (!refreshToken) {
    return NextResponse.json(
      { ok: false, error: "Refresh token is missing." },
      { status: 401 },
    );
  }

  let data: LoginResponse | null = null;
  try {
    const res = await refreshUser({ refreshToken });
    if (!res.ok) {
      clearServerSessionCookies(cookieStore);
      const errorText = await res.text().catch(() => "");
      return NextResponse.json(
        {
          ok: false,
          error: "Refresh failed.",
          upstreamStatus: res.status,
          upstreamBody: errorText || null,
        },
        { status: 401 },
      );
    }

    data = (await res.json().catch(() => null)) as LoginResponse | null;
  } catch (error) {
    console.error("Refresh error", error);
    clearServerSessionCookies(cookieStore);
    return NextResponse.json(
      {
        ok: false,
        error: "Refresh failed.",
        upstreamStatus: 502,
        upstreamBody: error instanceof Error ? error.message : String(error),
      },
      { status: 401 },
    );
  }

  if (!data?.accessToken || !data?.refreshToken) {
    clearServerSessionCookies(cookieStore);
    return NextResponse.json(
      { ok: false, error: "Refresh response invalid." },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ ok: true });
  return setSessionCookies(response, data, { remember });
}
