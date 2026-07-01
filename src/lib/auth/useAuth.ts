"use client";

import { useEffect, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";

import { getSession, invalidateSession } from "@/lib/api/session";

import { withLocale } from "@/lib/i18n/href";

type UseAuthOptions = {
  requireAuth?: boolean;
};

export function useAuth(options: UseAuthOptions = {}) {
  const { requireAuth = false } = options;
  const router = useRouter();
  const pathname = usePathname() || "/";
  const params = useParams();
  const locale = (params?.locale as string) || "en";

  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let active = true;

    const checkSession = async () => {
      try {
        const session = await getSession();
        if (!active) return;
        setIsAuthenticated(Boolean(session?.authenticated));
        setIsLoading(false);
      } catch {
        if (!active) return;
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    };

    checkSession();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!requireAuth || isLoading || isAuthenticated) return;
    const redirectTo = `${pathname}${window.location.search}`;
    const loginUrl = withLocale(`/auth/login`, locale);
    router.replace(`${loginUrl}?redirectTo=${encodeURIComponent(redirectTo)}`);
  }, [isAuthenticated, isLoading, locale, pathname, requireAuth, router]);

  return {
    isAuthenticated,
    isLoading,
  };
}
