import { cookies } from "next/headers";

export async function getAccountIds(): Promise<number[]> {
  const cookieStore = await cookies();
  const raw = cookieStore.get("account_ids")?.value;
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((item) => typeof item === "number")
      : [];
  } catch {
    return [];
  }
}
