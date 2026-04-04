"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ---------------------------------------------------------------------------
// Data pools
// ---------------------------------------------------------------------------

const CITIES = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Chennai",
  "Hyderabad",
  "Kolkata",
  "Pune",
  "Ahmedabad",
  "Jaipur",
  "Lucknow",
] as const;

type City = (typeof CITIES)[number];

interface Asset {
  symbol: string;
  weight: number;
}

const ASSETS: Asset[] = [
  { symbol: "BTC", weight: 90 },
  { symbol: "USDT", weight: 10 },
];

const AMOUNTS = [500, 1_000, 2_000, 5_000, 10_000, 25_000, 50_000] as const;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function weightedRandom(assets: Asset[]): string {
  const total = assets.reduce((s, a) => s + a.weight, 0);
  let rand = Math.random() * total;
  for (const asset of assets) {
    rand -= asset.weight;
    if (rand <= 0) return asset.symbol;
  }
  return assets[0].symbol;
}

function pickRandom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function formatINR(amount: number): string {
  return "₹" + amount.toLocaleString("en-IN");
}

interface ActivityMessage {
  id: number;
  city: City;
  asset: string;
  amount: number;
  text: string;
}

let messageId = 0;

function generateMessage(): ActivityMessage {
  const city = pickRandom(CITIES);
  const asset = weightedRandom(ASSETS);
  const amount = pickRandom(AMOUNTS);
  messageId += 1;
  return {
    id: messageId,
    city,
    asset,
    amount,
    text: `Someone in ${city} just bought ${formatINR(amount)} of ${asset}`,
  };
}

function randomInterval(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function LiveActivityFeed() {
  const [message, setMessage] = useState<ActivityMessage>(generateMessage);
  const [buyerCount, setBuyerCount] = useState(
    () => 780 + Math.floor(Math.random() * 40),
  );
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Rotate activity message every 4-6 seconds
  const scheduleNext = useCallback(() => {
    timerRef.current = setTimeout(() => {
      setMessage(generateMessage());
      scheduleNext();
    }, randomInterval(4_000, 6_000));
  }, []);

  useEffect(() => {
    scheduleNext();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [scheduleNext]);

  // Increment buyer counter every 3-5 seconds
  useEffect(() => {
    const tick = () => {
      setBuyerCount((c) => c + Math.floor(1 + Math.random() * 3));
    };
    const id = setInterval(tick, randomInterval(3_000, 5_000));
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="w-full bg-surface-elevated/60 backdrop-blur-xl border-y border-border-subtle"
      role="status"
      aria-live="polite"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-10 flex items-center justify-between gap-4 overflow-hidden">
        {/* Left: LIVE indicator + rotating message */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Pulse dot + LIVE label */}
          <span className="flex items-center gap-1.5 shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            <span className="text-xs font-semibold tracking-wider text-green-400 uppercase">
              Live
            </span>
          </span>

          {/* Animated message */}
          <div className="relative h-5 flex items-center overflow-hidden min-w-0">
            <AnimatePresence mode="wait">
              <motion.span
                key={message.id}
                initial={{ y: 16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -16, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="text-sm text-text-secondary whitespace-nowrap truncate"
              >
                {message.text}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        {/* Right: buyer counter */}
        <span className="text-sm text-text-tertiary whitespace-nowrap shrink-0 hidden sm:inline-flex items-center gap-1.5">
          <span className="text-text-secondary font-medium tabular-nums">
            {buyerCount.toLocaleString("en-IN")}
          </span>{" "}
          people bought Bitcoin in the last hour
        </span>
      </div>
    </div>
  );
}
