import { clientFetch } from "@/lib/api/clientFetch";
import { getApiBase } from "@/lib/api/getApiBase";
import { SendTfaCodePayload, SendTfaResponse, VerifyTfaPayload } from "@/types/tfa";

export async function verifyTfa(payload: VerifyTfaPayload) {
    const base = getApiBase();
    const res = await clientFetch(`${base}/v3/tfa/verify`, {
        method: "POST",
        headers: {
            "Accept-Language": "en-US",
        },
        body: JSON.stringify(payload)
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

export async function sendTfaCode(payload: SendTfaCodePayload) {
    const base = getApiBase();
    return clientFetch<SendTfaResponse & { ok: boolean, message?: string }>(`${base}/v3/tfa/send-code`, {
        method: "POST",
        headers: {
            "Accept-Language": "en-US",
        },
        body: JSON.stringify(payload),
        parseJson: true
    });
}