import { clientFetch } from "@/lib/api/clientFetch";
import { getApiBase } from "@/lib/api/getApiBase";
import type {
    ApplicationDetailResponse,
    BankInfoRequest,
    OfficerInfoRequest,
    ShareholdersRequest
} from "@/types/application";

export async function getApplicationDetail(locale: string = "en-US"): Promise<ApplicationDetailResponse | null> {
    const base = getApiBase();
    const res = await clientFetch(`${base}/v3/application/detail`, {
        headers: {
            "Accept": "application/json",
            "Accept-Language": locale,
        }
    });

    if (res?.ok === false) {
        return null;
    }

    return res?.json() || null;
}

export async function updateShareholders(payload: ShareholdersRequest, locale: string = "en-US") {
    const base = getApiBase();
    return clientFetch(`${base}/v3/application/shareholders`, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Accept-Language": locale,
        },
        body: JSON.stringify(payload)
    });
}

export async function updateBankInfo(payload: BankInfoRequest, locale: string = "en-US") {
    const base = getApiBase();
    return clientFetch(`${base}/v3/application/corporate-bank-info`, {
        method: "PUT",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Accept-Language": locale,
        },
        body: JSON.stringify(payload)
    });
}

export async function updateOfficerInfo(payload: OfficerInfoRequest, locale: string = "en-US") {
    const base = getApiBase();
    return clientFetch(`${base}/v3/application/user-info`, {
        method: "PUT",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Accept-Language": locale,
        },
        body: JSON.stringify(payload)
    });
}

