"use client";

import { getSession } from "@/lib/api/session";
import { startIcrypexSocket } from "@/lib/websocket/icrypexSocketClient";
import { useCryptoStore } from "@/stores/useCryptoStore";
import { useExchangeInfoStore } from "@/stores/useExchangeInfoStore";
import type { IcrypexExchangeInfo } from "@/types/icrypex";
import { useEffect } from "react";

export function DataInitializer({
    locale,
    initialExchangeInfo,
}: {
    locale: string;
    initialExchangeInfo?: IcrypexExchangeInfo | null;
}) {
    const { fetchCryptoAssets } = useCryptoStore();
    const setExchangeInfo = useExchangeInfoStore((state) => state.setExchangeInfo);

    useEffect(() => {
        setExchangeInfo(initialExchangeInfo ?? null);
        startIcrypexSocket();
    }, [initialExchangeInfo, setExchangeInfo]);

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
