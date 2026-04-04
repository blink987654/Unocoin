"use client";

import { useState, useEffect, useRef, useCallback } from "react";

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

// ─── Music Button ─────────────────────────────────────────────

function MusicToggle() {
  const [playing, setPlaying] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const toggle = useCallback(() => {
    if (!playing) {
      // Create hidden iframe to stream audio
      if (!iframeRef.current) {
        const iframe = document.createElement("iframe");
        iframe.src = "https://www.youtube.com/embed/H9Q8IbkkwDM?autoplay=1&loop=1&playlist=H9Q8IbkkwDM&controls=0";
        iframe.allow = "autoplay";
        iframe.style.cssText = "position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;opacity:0;pointer-events:none";
        document.body.appendChild(iframe);
        iframeRef.current = iframe;
      }
      setPlaying(true);
    } else {
      if (iframeRef.current) {
        iframeRef.current.remove();
        iframeRef.current = null;
      }
      setPlaying(false);
    }
  }, [playing]);

  return (
    <button
      onClick={toggle}
      title={playing ? "Pause music" : "Play music"}
      className="flex items-center justify-center w-6 h-6 rounded-md hover:bg-white/5 transition-colors"
    >
      {playing ? (
        <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5 text-bitcoin">
          <rect x="4" y="4" width="5" height="16" rx="1" fill="currentColor" />
          <rect x="15" y="4" width="5" height="16" rx="1" fill="currentColor" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5 text-text-tertiary hover:text-text-secondary">
          <path d="M9 18V5l12 6.5L9 18z" fill="currentColor" />
        </svg>
      )}
    </button>
  );
}

// ─── Theme Toggle ─────────────────────────────────────────────

function ThemeToggle() {
  const [light, setLight] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("ib_theme");
    if (stored === "light") {
      setLight(true);
      document.documentElement.classList.add("light-theme");
    }
  }, []);

  const toggle = useCallback(() => {
    const next = !light;
    setLight(next);
    if (next) {
      document.documentElement.classList.add("light-theme");
      localStorage.setItem("ib_theme", "light");
    } else {
      document.documentElement.classList.remove("light-theme");
      localStorage.setItem("ib_theme", "dark");
    }
  }, [light]);

  return (
    <button
      onClick={toggle}
      title={light ? "Switch to dark" : "Switch to light"}
      className="flex items-center justify-center w-6 h-6 rounded-md hover:bg-white/5 transition-colors"
    >
      {light ? (
        <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5 text-text-tertiary">
          <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" fill="currentColor" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5 text-text-tertiary">
          <circle cx="12" cy="12" r="5" fill="currentColor" />
          <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )}
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────

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
          {/* Scrolling track */}
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

          {/* Controls pinned to right edge */}
          <div className="absolute right-0 top-0 h-full flex items-center gap-2 pr-3 pl-8 bg-gradient-to-l from-surface-elevated/95 via-surface-elevated/85 to-transparent">
            <MusicToggle />
            <ThemeToggle />
            <span className="relative flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-green-400 pointer-events-none">
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
