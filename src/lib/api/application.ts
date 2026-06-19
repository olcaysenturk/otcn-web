import { ApplicationFormInputs, ApplicationPayload } from "@/types/application";
import { getApiLocale } from "@/lib/i18n/config";
import { getApiBase } from "./getApiBase";

const VOLUME_MAPPING: Record<string, string> = {
  "0-50k": "0 - 50.000 USD",
  "50k-250k": "50.000 - 250.000 USD",
  "250k-1m": "250.000 - 1.000.000 USD",
  "1mPlus": "1.000.000 USD +",
};

function mapToPayload(values: ApplicationFormInputs): ApplicationPayload {
  return {
    email: values.email,
    phoneNumber: `${values.phoneCountryCode || ""}${values.phone}`,
    companyName: values.companyName,
    firstName: values.firstName,
    lastName: values.lastName,
    averageVolume: VOLUME_MAPPING[values.estimatedVolume || ""] || values.estimatedVolume || "",
  };
}


export async function submitApplicationForm(values: ApplicationFormInputs, locale: string = "en-US") {
  const apiBase = getApiBase();
  const payload = mapToPayload(values);

  // Map simple locale codes to full codes if necessary, or pass through
  const acceptLanguage = /^[a-z]{2}$/.test(locale) ? getApiLocale(locale) : locale;

  const res = await fetch(`${apiBase}/v3/Authentication/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "accept": "*/*",
      "Accept-Language": acceptLanguage,
    },
    body: JSON.stringify(payload),
  });

  if (res.status !== 200) {
    const errorBody = await res.text();
    console.error("Application submission failed:", {
      status: res.status,
      statusText: res.statusText,
      body: errorBody
    });
    throw new Error(`Application submission failed: ${res.status} ${res.statusText} - ${errorBody}`);
  }

  return res.json();
}
