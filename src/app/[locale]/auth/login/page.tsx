import { Metadata } from "next";
import { getLocalizedMetadata } from "@/lib/seo/metadata";
import LoginFormClient from "./LoginFormClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    alternates: getLocalizedMetadata("/auth/login", locale),
  };
}

export default function Page() {
  return <LoginFormClient />;
}
