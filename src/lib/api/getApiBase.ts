export function getApiBase() {
  const base = process.env.NEXT_PUBLIC_API_BASE;
  if (!base) {
    throw new Error("Public API base is not configured");
  }
  return base.replace(/\/$/, "");
}
