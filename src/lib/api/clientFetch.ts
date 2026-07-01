import { getSession, refreshSession } from "./session";

type ClientFetchArgs = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  body?: BodyInit | null;
  parseJson?: boolean
};

let refreshPromise: Promise<any> | null = null;


export async function clientFetch(path: string, args?: ClientFetchArgs): Promise<Response>;
export async function clientFetch<T>(path: string, args: ClientFetchArgs): Promise<T>;
export async function clientFetch<T = Response>(path: string, args: ClientFetchArgs = {}): Promise<T | Response> {
  const session = await getSession();
  const accountId = session?.accountIds?.[0];
  const accessToken = session?.accessToken;

  if (!session?.authenticated || !accessToken || !accountId) {
    throw new Error("Unauthorized: No valid session");
  }

  const serializedBody = args.body ?
    (typeof args.body === 'string' ? args.body : JSON.stringify(args.body))
    : null;

  const makeRequest = async (token: string, accId: number) => {
    const headers: Record<string, string> = {
      ...(args.headers ?? {}),
      Authorization: `Bearer ${token}`,
      AccountId: String(accId),
    };

    if (serializedBody && !headers["Content-Type"]) {
      headers["Content-Type"] = "application/json";
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const res = await fetch(path, {
        method: args.method ?? "GET",
        headers,
        body: serializedBody,
        cache: "no-store",
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return res;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  };

  try {
    const res = await makeRequest(accessToken, accountId);

    if (res.status === 401 || res.status === 403) {
      if (!refreshPromise) {
        refreshPromise = refreshSession().finally(() => {
          refreshPromise = null;
        });
      }

      const refreshed = await refreshPromise;
      const retryAccountId = refreshed?.accountIds?.[0];
      const retryToken = refreshed?.accessToken;

      if (!retryToken || !retryAccountId) {
        throw new Error("Token refresh failed");
      }

      const retryRes = await makeRequest(retryToken, retryAccountId);

      if (retryRes.status === 401 || retryRes.status === 403) {
        throw new Error("Authentication failed after token refresh");
      }

      if (args.parseJson) {
        try {
          return await retryRes.json();
        } catch (error) {
          console.error("Retry json parse failed:", error);
          throw error;
        }
      }
      return retryRes;
    }

    if (args.parseJson) {
      try {
        return await res.json();
      } catch (error) {
        console.error("Initial json parse failed:", error);
        throw error;
      }
    }

    return res;
  } catch (error) {
    console.error("clientFetch failed:", error);
    throw error;
  }
}