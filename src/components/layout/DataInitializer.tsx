"use client";

import { getSession } from "@/lib/api/session";
import { useCryptoStore } from "@/stores/useCryptoStore";
import { useEffect } from "react";

export function DataInitializer({ locale }: { locale: string }) {
    const { fetchCryptoAssets } = useCryptoStore();
    useEffect(() => {
        let active = true;

        const initialize = async () => {
            const session = await getSession();
            if (!active || !session?.authenticated) return;
            await fetchCryptoAssets(locale);
        };

        initialize();

        return () => {
            active = false;
        };
    }, [locale, fetchCryptoAssets]);
    return null;
}
