import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { logoutUser } from "@/services/auth";
import { clearServerSessionCookies } from "@/lib/auth/sessionCookies";

export async function POST() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (accessToken && refreshToken) {
    try {
      await logoutUser({ accessToken, refreshToken });
    } catch (error) {
      console.error("Logout error", error);
    }
  }

  const response = NextResponse.json({ ok: true });
  clearServerSessionCookies(cookieStore);

  return response;
}
