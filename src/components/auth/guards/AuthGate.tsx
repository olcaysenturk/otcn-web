"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { withLocale } from "@/lib/i18n/href";
import { getInternalPath } from "@/lib/i18n/navigation";

type AuthGateProps = {
  children: ReactNode;
  requireAuth?: boolean;
  isAuthenticated: boolean;
};

export function AuthGate({
  children,
  requireAuth = true,
  isAuthenticated,
}: AuthGateProps) {
  const pathname = usePathname() || "/";
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const router = useRouter();

  const internalPath = getInternalPath(pathname);
  const isHome = internalPath.split("/").filter(Boolean).length <= 1;
  const isAuth = internalPath.startsWith("/auth");
  const isPublicMarket = internalPath.startsWith("/markets");
  const isPublicSpotDetail = internalPath.startsWith("/trade/spot");
  const shouldRequireAuth =
    requireAuth &&
    !isHome &&
    !isAuth &&
    !isPublicMarket &&
    !isPublicSpotDetail;

  useEffect(() => {
    if (!shouldRequireAuth || isAuthenticated) return;
    const redirectTo = `${pathname}${window.location.search}`;
    const loginUrl = withLocale("/auth/login", locale);
    router.replace(`${loginUrl}?redirectTo=${encodeURIComponent(redirectTo)}`);
  }, [isAuthenticated, locale, pathname, router, shouldRequireAuth]);

  if (shouldRequireAuth && !isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
