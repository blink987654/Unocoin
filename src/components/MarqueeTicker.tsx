"use client";

import { useState, useEffect } from "react";

interface CoinPrice {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
}

const fallbackData: CoinPrice[] = [
  { symbol: "BTC", name: "Bitcoin", price: 84231, change24h: 2.4 },
  { symbol: "USDT", name: "Tether", price: 1.0, change24h: 0.01 },
];

/** Height of the marquee bar in pixels, export so pages can add matching padding. */
export const MARQUEE_HEIGHT = 36;

const USD_TO_INR = 83;

function formatPrice(priceUsd: number): string {
  const price = priceUsd * USD_TO_INR;
  if (price >= 100) {
    return "₹" + price.toLocaleString("en-IN", { maximumFractionDigits: 0 });
  }
  if (price >= 1) {
    return "₹" + price.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  return "₹" + price.toFixed(price < 0.01 ? 4 : 3);
}

function CoinItem({ coin }: { coin: CoinPrice }) {
  const positive = coin.change24h >= 0;
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap px-4">
      <span className="font-semibold text-text-primary text-xs">{coin.symbol}</span>
      <span className="text-text-secondary text-xs font-mono">{formatPrice(coin.price)}</span>
      <span className={`text-xs font-medium ${positive ? "text-green-400" : "text-red-400"}`}>
        {positive ? "▲" : "▼"} {Math.abs(coin.change24h).toFixed(2)}%
      </span>
      <span className="text-border-subtle mx-1 select-none" aria-hidden>·</span>
    </span>
  );
}

export default function MarqueeTicker() {
  const [coins, setCoins] = useState<CoinPrice[]>(fallbackData);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/prices")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: CoinPrice[]) => {
        if (!cancelled && Array.isArray(data) && data.length > 0) setCoins(data);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const items = coins.map((c) => <CoinItem key={c.symbol} coin={c} />);

  return (
    <>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      <div
        className="fixed left-0 right-0 z-40 top-16 lg:top-20 bg-surface-elevated/80 backdrop-blur-xl border-b border-border-subtle overflow-hidden select-none"
        style={{ height: MARQUEE_HEIGHT }}
      >
        <div className="relative h-full flex items-center">
          {/* Scrolling track — two copies for seamless loop */}
          <div
            className="flex items-center"
            style={{
              animation: "marquee 40s linear infinite",
              willChange: "transform",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.animationPlayState = "paused"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.animationPlayState = "running"; }}
          >
            {items}
            {items}
          </div>

          {/* Live indicator pinned to right edge */}
          <div className="absolute right-0 top-0 h-full flex items-center pr-3 pl-6 bg-gradient-to-l from-surface-elevated/90 via-surface-elevated/80 to-transparent pointer-events-none">
            <span className="relative flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-green-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
              </span>
              Live
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
