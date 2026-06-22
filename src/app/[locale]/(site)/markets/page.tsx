import type { Metadata } from "next";

import { MarketPage } from "@/components/market/MarketPage";

export const metadata: Metadata = {
  title: "Markets | OTCN",
  description: "Kripto varlık fiyatlarını ve piyasa hareketlerini takip edin.",
};

export default function MarketsRoute() {
  return <MarketPage />;
}
