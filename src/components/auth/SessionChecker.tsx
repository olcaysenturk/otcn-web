"use client";

import { useEffect } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { getSession } from "@/lib/api/session";
import { withLocale } from "@/lib/i18n/href";
import { getInternalPath } from "@/lib/i18n/navigation";

const PUBLIC_ROUTES = [
    "/auth/login",
    "/auth/register",
    "/auth/forgot-password",
    "/markets",
    "/trade/spot",
];

export function SessionChecker() {
    const pathname = usePathname();
    const router = useRouter();
    const params = useParams();
    const locale = (params?.locale as string) || "en";

    useEffect(() => {
        const checkSession = async () => {
            const internalPath = getInternalPath(pathname);
            const isAuthRoute =
                internalPath === "/auth" || internalPath.startsWith("/auth/");
            const isPublicRoute = PUBLIC_ROUTES.some(
                (route) =>
                    internalPath === route || internalPath.startsWith(`${route}/`),
            );
            // Homepage check: root "/" or "/xx" (2-letter locale)
            const isHomePage = internalPath === "/" || /^\/[a-z]{2}$/.test(internalPath);

            if (isAuthRoute || isPublicRoute || isHomePage) return;

            const session = await getSession();
            if (!session?.authenticated) {
                router.push(withLocale("/auth/login", locale));
            }
        };

        checkSession();
    }, [pathname, router, locale]);

    return null;
}
