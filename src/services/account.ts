import { clientFetch } from "@/lib/api/clientFetch";
import { getApiBase } from "@/lib/api/getApiBase";
import { AccountInfo } from "@/types/account";
import {
  GetApplicationDetailResponse,
  UpdateAuthorizedUserInfoPayload,
  UpsertShareHoldersPayload
} from "@/types/application";
import { TfaInitiateResponse } from "@/types/auth";
import { UserBank } from "@/types/bank";
import { TfaType } from "@/types/tfa";

/**
 * Fetches general account and user information.
 * GET /v3/account/info
 */
export async function getAccountInfo(): Promise<AccountInfo | null> {
  const base = getApiBase();
  const url = `${base}/v3/account/info`;

  const res = await clientFetch(url);

  if (!res?.ok) {
    return null;
  }

  try {
    return await res.json();
  } catch (error) {
    console.error("Failed to parse account info:", error);
    return null;
  }
}

/**
 * Fetches all bank accounts associated with the current user.
 * GET /v3/user-banks
 */
export async function getUserBanks(): Promise<UserBank[]> {
  const base = getApiBase();
  const url = `${base}/v3/user-banks`;

  const res = await clientFetch(url);

  if (!res?.ok) {
    return [];
  }

  try {
    return await res.json();
  } catch (error) {
    console.error("Failed to parse user banks:", error);
    return [];
  }
}

/**
 * Adds a new bank account for the user.
 * POST /v3/user-banks
 */
export async function addUserBank(data: {
  label: string;
  iban: string;
  currency: string;
  bankId: number;
}): Promise<{ success: boolean; message?: string }> {
  const base = getApiBase();
  const url = `${base}/v3/user-banks`;

  const res = await clientFetch(url, {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (!res?.ok) {
    try {
      const errorData = await res?.json();
      return { success: false, message: errorData?.message };
    } catch (e) {
      return { success: false };
    }
  }

  return { success: true };
}

export async function deleteUserBank(bankAccountId: number): Promise<{ success: boolean; message?: string }> {
  const base = getApiBase();
  const url = `${base}/v3/user-banks/${bankAccountId}`;

  const res = await clientFetch(url, {
    method: "DELETE",
  });

  if (!res?.ok) {
    try {
      const errorData = await res?.json();
      return { success: false, message: errorData?.message };
    } catch (e) {
      return { success: false };
    }
  }

  return { success: true };
}

/**
 * Fetches application details including corporate info and shareholders.
 * GET /v3/application/detail
 */
export async function getApplicationDetail(): Promise<GetApplicationDetailResponse | null> {
  const base = getApiBase();
  const url = `${base}/v3/application/detail`;

  const res = await clientFetch(url);

  if (!res?.ok) {
    return null;
  }

  try {
    return await res.json();
  } catch (error) {
    console.error("Failed to parse application detail:", error);
    return null;
  }
}

/**
 * Adds shareholders to an application.
 * POST /v3/application/shareholders
 */
export async function addShareholders(data: UpsertShareHoldersPayload): Promise<{ success: boolean; message?: string }> {
  const base = getApiBase();
  const url = `${base}/v3/application/shareholders`;

  const res = await clientFetch(url, {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (!res?.ok) {
    try {
      const errorData = await res?.json();
      return { success: false, message: errorData?.message };
    } catch (e) {
      return { success: false };
    }
  }

  return { success: true };
}

/**
 * Updates authorized user information.
 * PUT /v3/application/user-info
 */
export async function updateAuthorizedUserInfo(data: UpdateAuthorizedUserInfoPayload): Promise<{ success: boolean; message?: string }> {
  const base = getApiBase();
  const url = `${base}/v3/application/user-info`;

  const res = await clientFetch(url, {
    method: "PUT",
    body: JSON.stringify(data),
  });

  if (!res?.ok) {
    try {
      const errorData = await res?.json();
      return { success: false, message: errorData?.message };
    } catch (e) {
      return { success: false };
    }
  }

  return { success: true };
}

/**
 * Fetches the list of cities.
 * GET /v3/region/cities
 */
export async function getCities(): Promise<any[]> {
  const base = getApiBase();
  const url = `${base}/v3/region/cities?countryCode=TR`;

  const res = await clientFetch(url);

  if (!res?.ok) {
    return [];
  }

  try {
    const data = await res.json();
    return data?.content || data || [];
  } catch (error) {
    console.error("Failed to parse cities:", error);
    return [];
  }
}

/**
 * Fetches the list of districts for a city.
 * GET /v3/region/districts?cityId={cityId}
 */
export async function getDistricts(cityId: number): Promise<any[]> {
  const base = getApiBase();
  const url = `${base}/v3/region/districts?cityId=${cityId}`;

  const res = await clientFetch(url);

  if (!res?.ok) {
    return [];
  }

  try {
    const data = await res.json();
    return data?.content || data || [];
  } catch (error) {
    console.error("Failed to parse districts:", error);
    return [];
  }
}
/**
 * Fetches the user's 2FA options/status.
 * GET /v3/tfa-options
 */
export async function getTfaOptions(): Promise<{
  phone: boolean;
  email: boolean;
  authenticator: boolean;
} | null> {
  const base = getApiBase();
  const url = `${base}/v3/tfa-options`;

  const res = await clientFetch(url);

  if (!res?.ok) {
    return null;
  }

  try {
    return await res.json();
  } catch (error) {
    console.error("Failed to parse tfa options:", error);
    return null;
  }
}

export function initiateTfaSetting(type: TfaType, enabled: boolean) {
  const base = getApiBase();
  const mappedType = type === "Sms" ? "phone" : type;
  const url = `${base}/v3/tfa-options/${mappedType.toLowerCase()}-initiate`;

  return clientFetch<TfaInitiateResponse & { ok: boolean, message?: string }>(url, {
    method: "PUT",
    body: JSON.stringify({ enabled }),
    parseJson: true,
  });

}

export async function completeTfaSetting(type: TfaType, flowId: string) {
  const base = getApiBase();
  const mappedType = type === "Sms" ? "phone" : type;
  const url = `${base}/v3/tfa-options/${mappedType.toLowerCase()}-complete`;

  const res = await clientFetch(url, {
    method: "PUT",
    body: JSON.stringify({ flowId }),
  });

  if (!res?.ok) {
    try {
      const errorData = await res?.json();
      return { success: false, message: errorData?.message };
    } catch (e) {
      return { success: false };
    }
  }

  return { success: true };
}
