import { NextResponse } from "next/server";

import { loginUser } from "@/services/auth";
import type { LoginResponse } from "@/types/auth";
import { setSessionCookies } from "@/lib/auth/sessionCookies";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { username?: string; password?: string; remember?: boolean }
    | null;

  if (!body?.username || !body?.password) {
    return NextResponse.json(
      { ok: false, error: "Username and password are required." },
      { status: 400 },
    );
  }

  let data: LoginResponse | null = null;
  try {
    const res = await loginUser({ username: body.username, password: body.password });

    console.log("res", res);
    if (!res.ok) {
      const errorText = await res.text().catch(() => "");
      return NextResponse.json(
        {
          ok: false,
          error: "Login failed.",
          upstreamStatus: res.status,
          upstreamBody: errorText || null,
        },
        { status: res.status },
      );
    }

    data = (await res.json().catch(() => null)) as LoginResponse | null;
  } catch (error) {
    console.error("Login error", error);
    return NextResponse.json(
      {
        ok: false,
        error: "Login failed.",
        upstreamStatus: 502,
        upstreamBody: error instanceof Error ? error.message : String(error),
      },
      { status: 502 },
    );
  }

  if (!data?.accessToken || !data?.refreshToken) {
    // If it's a login-initiate response (e.g., contains flowId but no tokens), return the data directly
    return NextResponse.json({ ok: true, data });
  }

  const response = NextResponse.json({ ok: true });
  return setSessionCookies(response, data, { remember: body.remember === true });
}
