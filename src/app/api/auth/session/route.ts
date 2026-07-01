import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const accountIdsRaw = cookieStore.get("account_ids")?.value;
  let accountIds: number[] = [];

  if (accountIdsRaw) {
    try {
      const parsed = JSON.parse(accountIdsRaw);
      if (Array.isArray(parsed)) {
        accountIds = parsed.filter((item) => typeof item === "number");
      }
    } catch {
      accountIds = [];
    }
  }

  // TEMP DEV BYPASS — remove the `|| true` to restore real auth check
  return NextResponse.json({
    authenticated: Boolean(accessToken) || true,
    accessToken: accessToken ?? null,
    accountIds,
  });
}
