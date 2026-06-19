"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { withLocale } from "@/lib/i18n/href";

export default function Auth() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "en";

  useEffect(() => {
    router.replace(withLocale("/auth/login", locale));
  }, [router, locale]);

  return null;
}
