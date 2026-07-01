import { Metadata } from "next";
import { getLocalizedMetadata } from "@/lib/seo/metadata";
import AccountMenuClient from "./AccountMenuClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    alternates: getLocalizedMetadata("/account", locale),
  };
}

export default function Page() {
  return <AccountMenuClient />;
}
