import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const symbols = searchParams.get("symbols");

  if (!symbols) {
    return NextResponse.json({ error: "Symbols parameter is required" }, { status: 400 });
  }

  try {
    const res = await fetch(`https://api.binance.com/api/v3/ticker/price?symbols=${encodeURIComponent(symbols)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 30 }, // Cache for 30 seconds to avoid hitting limits too hard
    });

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json({ error: `Binance API error: ${res.status} ${errorText}` }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error fetching from Binance:", error);
    return NextResponse.json({ error: "Failed to fetch prices" }, { status: 500 });
  }
}
