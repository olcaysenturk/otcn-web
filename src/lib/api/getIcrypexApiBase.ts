export function getIcrypexApiBase() {
  const base = process.env.NEXT_PUBLIC_ICRYPEX_API_BASE;
  if (!base) {
    throw new Error("Icrypex API base is not configured");
  }
  return base.replace(/\/$/, "");
}

export function getIcrypexWsUrl() {
  const url = process.env.NEXT_PUBLIC_ICRYPEX_WS_URL;
  if (!url) {
    throw new Error("Icrypex WebSocket URL is not configured");
  }
  return url;
}
