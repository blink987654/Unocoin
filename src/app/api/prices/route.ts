import { NextResponse } from "next/server";

const CMC_API_KEY = process.env.CMC_API_KEY || "";

interface CmcQuote {
  price: number;
  percent_change_1h: number;
  percent_change_24h: number;
  market_cap: number;
}

interface CmcCurrency {
  symbol: string;
  name: string;
  quote: {
    USD: CmcQuote;
  };
}

// Cache for 30 seconds to avoid hitting rate limits
let cache: { data: ReturnType<typeof formatPrices> | null; timestamp: number } =
  { data: null, timestamp: 0 };

function formatPrices(currencies: CmcCurrency[]) {
  return currencies.map((c) => ({
    symbol: c.symbol,
    name: c.name,
    price: c.quote.USD.price,
    change1h: c.quote.USD.percent_change_1h,
    change24h: c.quote.USD.percent_change_24h,
    marketCap: c.quote.USD.market_cap,
  }));
}

export async function GET() {
  const now = Date.now();

  // Return cache if less than 30 seconds old
  if (cache.data && now - cache.timestamp < 30_000) {
    return NextResponse.json(cache.data, {
      headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60" },
    });
  }

  if (!CMC_API_KEY) {
    // Fallback data when no API key
    return NextResponse.json([
      { symbol: "BTC", name: "Bitcoin", price: 84231, change1h: 0.12, change24h: 2.4, marketCap: 1670000000000 },
      { symbol: "USDT", name: "Tether", price: 1.0, change1h: 0.0, change24h: 0.01, marketCap: 140000000000 },
    ]);
  }

  try {
    const res = await fetch(
      "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=BTC,USDT",
      {
        headers: {
          "X-CMC_PRO_API_KEY": CMC_API_KEY,
          Accept: "application/json",
        },
      }
    );

    if (!res.ok) {
      throw new Error(`CMC API error: ${res.status}`);
    }

    const json = await res.json();
    const data = json.data;
    const formatted = formatPrices(
      ["BTC", "USDT"].map((s) => data[s])
    );

    cache = { data: formatted, timestamp: now };

    return NextResponse.json(formatted, {
      headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60" },
    });
  } catch {
    // Return stale cache or fallback
    if (cache.data) {
      return NextResponse.json(cache.data);
    }
    return NextResponse.json([
      { symbol: "BTC", name: "Bitcoin", price: 84231, change1h: 0.12, change24h: 2.4, marketCap: 1670000000000 },
      { symbol: "USDT", name: "Tether", price: 1.0, change1h: 0.0, change24h: 0.01, marketCap: 140000000000 },
    ]);
  }
}
