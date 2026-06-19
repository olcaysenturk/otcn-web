import { clientFetch } from "@/lib/api/clientFetch";
import { getApiBase } from "@/lib/api/getApiBase";
import { AddCryptoAddressPayload, AddCryptoAddressResponse, AddDepositDeclarationPayload, CryptoAddress, CryptoAsset, CryptoAssetResponse, CryptoPlatform, PendingDepositDeclaration } from "@/types/crypto";

/**
 * Fetches the list of crypto platforms (VASPs).
 * GET /v3/crypto/platforms
 */
export async function getCryptoPlatforms(): Promise<CryptoPlatform[]> {
  const base = getApiBase();
  const url = `${base}/v3/crypto/platforms`;

  const res = await clientFetch(url);

  if (!res?.ok) {
    return [];
  }

  try {
    return await res.json();
  } catch (error) {
    console.error("Failed to parse crypto platforms:", error);
    return [];
  }
}

/**
 * Adds a new crypto deposit declaration.
 * POST /v3/crypto/deposit-add-declaration
 */
export async function addDepositDeclaration(data: AddDepositDeclarationPayload): Promise<{ success: boolean; message?: string }> {
  const base = getApiBase();
  const url = `${base}/v3/crypto/deposit-add-declaration`;

  const res = await clientFetch(url, {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (!res?.ok) {
    try {
      const errorData = await res?.json();
      return { success: false, message: errorData?.message };
    } catch {
      return { success: false };
    }
  }

  return { success: true };
}
export async function fetchCryptoAssets(locale: string) {
  const base = getApiBase();
  const res = await clientFetch<CryptoAssetResponse[]>(`${base}/v3/crypto/assets`, {
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": locale,
    },
    parseJson: true
  })
  return res.map(asset => ({
    ...asset,
    icon: `/assets/coin-logo/${asset.assetSymbol.toUpperCase()}.svg`
  })) as CryptoAsset[];
}

export async function fetchCryptoPlatforms(locale: string) {
  const base = getApiBase();
  const res = await clientFetch<CryptoPlatform[]>(`${base}/v3/crypto/platforms`, {
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": locale,
    },
    parseJson: true
  })
  return res;
}

export async function addCryptoAddressInit(data: AddCryptoAddressPayload): Promise<AddCryptoAddressResponse & { message?: string }> {
  const base = getApiBase();
  const url = `${base}/v3/crypto/address/white-list/init`;

  return clientFetch<AddCryptoAddressResponse & { message?: string }>(url, {
    method: "POST",
    body: JSON.stringify(data),
    parseJson: true
  });
}

export async function addCryptoAddressComplete(flowId: string) {
  const base = getApiBase();
  const url = `${base}/v3/crypto/address/white-list/complete`;

  return clientFetch<{ id: string }>(url, {
    method: "POST",
    body: JSON.stringify({ flowId }),
    parseJson: true
  });
}

export async function getCryptoAddresses(assetSymbol: string, locale: string = "en-US") {
  const base = getApiBase();
  const normalizedAsset = assetSymbol.trim().toLowerCase();
  const res = await clientFetch(`${base}/v3/crypto/address/white-list?asset=${encodeURIComponent(normalizedAsset)}`, {
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": locale,
    },
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null) as { message?: string } | null;
    throw new Error(errorBody?.message || `Address white-list request failed: ${res.status}`);
  }

  const data = await res.json().catch(() => null) as unknown;
  return Array.isArray(data) ? (data as CryptoAddress[]) : [];
}

export async function deleteCryptoAddress(id: number): Promise<{ success: boolean; message?: string }> {
  const base = getApiBase();
  const res = await clientFetch(`${base}/v3/crypto/address/white-list/${id}`, {
    method: "DELETE",
  });

  if (!res?.ok) {
    try {
      const errorData = await res?.json();
      return { success: false, message: errorData?.message };
    } catch {
      return { success: false };
    }
  }

  return { success: true };
}

export async function fetchPendingDepositDeclarations(
  locale: string,
  filters: { assetSymbol?: string; networkName?: string } = {},
) {
  const base = getApiBase();
  const params = new URLSearchParams();
  if (filters.assetSymbol) params.set("assetSymbol", filters.assetSymbol);
  if (filters.networkName) params.set("networkName", filters.networkName);
  const query = params.toString() ? `?${params.toString()}` : "";

  return clientFetch<PendingDepositDeclaration[]>(`${base}/v3/crypto/deposit-waiting-declaration${query}`, {
    headers: {
      Accept: "*/*",
      "Accept-Language": locale,
    },
    parseJson: true,
  });
}
