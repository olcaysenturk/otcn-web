import { clientFetch } from "@/lib/api/clientFetch";
import { getApiBase } from "@/lib/api/getApiBase";
import { City, Country, District } from "@/types/region";

export async function getCountries(): Promise<Country[]> {
    const base = getApiBase();
    const url = `${base}/v3/region/countries`;
    const res = await clientFetch(url);
    if (!res?.ok) {
        return [];
    }
    return res.json();
}

export async function getCities(countryCode: string = "TR"): Promise<City[]> {
    const base = getApiBase();
    const url = `${base}/v3/region/cities?countryCode=${countryCode}`;
    const res = await clientFetch(url);
    if (!res?.ok) {
        return [];
    }
    return res.json();
}

export async function getDistricts(cityId: number): Promise<District[]> {
    const base = getApiBase();
    const url = `${base}/v3/region/districts?cityId=${cityId}`;
    const res = await clientFetch(url);
    if (!res?.ok) {
        return [];
    }
    return res.json();
}
