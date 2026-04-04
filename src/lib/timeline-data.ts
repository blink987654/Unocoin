import type { TimelineEvent, SBPSimulation } from "@/lib/types";

// ─── Static Bitcoin Timeline Data ────────────────────────────
// BTC prices in INR (historical USD price x approximate USD/INR rate at the time)

export const TIMELINE_EVENTS: TimelineEvent[] = [
  // Genesis Era
  { date: "2009-01-03", btcPriceINR: 0, headline: "Genesis block mined by Satoshi Nakamoto", era: "genesis" },
  { date: "2009-10-05", btcPriceINR: 0.05, headline: "First Bitcoin exchange rate established: $0.001", era: "genesis" },
  { date: "2010-05-22", btcPriceINR: 0.3, headline: "Pizza Day - 10,000 BTC for two pizzas", era: "genesis" },
  { date: "2010-07-17", btcPriceINR: 3.5, headline: "Mt. Gox exchange launches", era: "genesis" },
  { date: "2010-11-06", btcPriceINR: 14, headline: "Bitcoin market cap reaches $1 million", era: "genesis" },

  // Early Era
  { date: "2011-02-09", btcPriceINR: 45, headline: "BTC reaches parity with USD ($1 = 1 BTC)", era: "early" },
  { date: "2011-06-08", btcPriceINR: 1500, headline: "BTC hits $30 - first major rally", era: "early" },
  { date: "2011-06-19", btcPriceINR: 700, headline: "Mt. Gox hacked - BTC crashes to $14", era: "early" },
  { date: "2012-11-28", btcPriceINR: 660, headline: "First Bitcoin halving - block reward drops to 25 BTC", era: "early" },
  { date: "2013-03-28", btcPriceINR: 5000, headline: "Bitcoin market cap crosses $1 billion", era: "early" },

  // Growth Era
  { date: "2013-04-01", btcPriceINR: 5500, headline: "BTC crosses $100 for the first time", unocoinMilestone: "Unocoin founded", era: "growth" },
  { date: "2013-11-29", btcPriceINR: 62000, headline: "BTC hits $1,000 - mainstream attention", era: "growth" },
  { date: "2014-02-25", btcPriceINR: 30000, headline: "Mt. Gox collapses - 850,000 BTC lost", era: "growth" },
  { date: "2015-01-14", btcPriceINR: 10500, headline: "BTC bottoms at $170 after long bear market", unocoinMilestone: "India's first Bitcoin SBP launched", era: "growth" },
  { date: "2015-10-22", btcPriceINR: 17500, headline: "EU rules Bitcoin is VAT-exempt", era: "growth" },
  { date: "2016-07-09", btcPriceINR: 43000, headline: "Second halving - block reward drops to 12.5 BTC", era: "growth" },
  { date: "2017-01-03", btcPriceINR: 68000, headline: "BTC crosses $1,000 again after 3 years", era: "growth" },
  { date: "2017-08-01", btcPriceINR: 180000, headline: "Bitcoin Cash forks from Bitcoin", era: "growth" },
  { date: "2017-12-17", btcPriceINR: 1270000, headline: "BTC ATH at $19,783 - global FOMO", era: "growth" },

  // Ban Era
  { date: "2018-01-15", btcPriceINR: 850000, headline: "Crypto crash begins - BTC falls from ATH", era: "ban" },
  { date: "2018-04-06", btcPriceINR: 450000, headline: "RBI issues banking ban on crypto transactions", unocoinMilestone: "RBI bans crypto banking", era: "ban" },
  { date: "2018-10-31", btcPriceINR: 430000, headline: "Unocoin founders briefly detained", unocoinMilestone: "Founders stand firm despite challenges", era: "ban" },
  { date: "2019-07-22", btcPriceINR: 680000, headline: "Supreme Court hearing on crypto ban begins", era: "ban" },

  // Revival Era
  { date: "2020-03-04", btcPriceINR: 560000, headline: "Supreme Court lifts RBI crypto banking ban", unocoinMilestone: "Supreme Court validates crypto", era: "revival" },
  { date: "2020-03-13", btcPriceINR: 285000, headline: "COVID crash - BTC drops to $3,800", era: "revival" },
  { date: "2020-05-11", btcPriceINR: 650000, headline: "Third halving - block reward drops to 6.25 BTC", era: "revival" },
  { date: "2020-10-21", btcPriceINR: 960000, headline: "PayPal announces Bitcoin support", era: "revival" },
  { date: "2020-12-16", btcPriceINR: 1480000, headline: "BTC breaks previous ATH of $20,000", era: "revival" },
  { date: "2021-02-08", btcPriceINR: 3400000, headline: "Tesla buys $1.5 billion in Bitcoin", era: "revival" },
  { date: "2021-04-14", btcPriceINR: 4750000, headline: "Coinbase IPO - BTC hits $64,000", era: "revival" },
  { date: "2021-06-09", btcPriceINR: 2700000, headline: "El Salvador passes Bitcoin legal tender law", era: "revival" },
  { date: "2021-09-07", btcPriceINR: 3800000, headline: "El Salvador officially adopts Bitcoin", era: "revival" },
  { date: "2021-11-10", btcPriceINR: 5100000, headline: "BTC reaches ATH of $68,789", era: "revival" },

  // Institutional Era
  { date: "2022-05-12", btcPriceINR: 2400000, headline: "Terra/Luna collapse shakes crypto markets", era: "institutional" },
  { date: "2022-11-11", btcPriceINR: 1360000, headline: "FTX collapse - BTC falls to $16,000", era: "institutional" },
  { date: "2023-01-01", btcPriceINR: 1380000, headline: "Recovery begins after brutal 2022 bear market", era: "institutional" },
  { date: "2023-06-15", btcPriceINR: 2150000, headline: "BlackRock files for spot Bitcoin ETF", era: "institutional" },
  { date: "2024-01-10", btcPriceINR: 3800000, headline: "US spot Bitcoin ETF approved", unocoinMilestone: "Institutional era begins", era: "institutional" },
  { date: "2024-04-20", btcPriceINR: 5300000, headline: "Fourth halving - block reward drops to 3.125 BTC", era: "institutional" },
  { date: "2024-09-17", btcPriceINR: 4900000, headline: "Bitcoin ETFs surpass $50B in assets under management", era: "institutional" },
  { date: "2024-11-05", btcPriceINR: 6050000, headline: "Trump wins US election - BTC surges to $73K", era: "institutional" },
  { date: "2024-12-05", btcPriceINR: 8300000, headline: "Bitcoin crosses $100,000 for the first time", era: "institutional" },
  { date: "2025-01-20", btcPriceINR: 9050000, headline: "BTC hits $109K all-time high", unocoinMilestone: "Lightning Network integration", era: "institutional" },
  { date: "2025-04-04", btcPriceINR: 7015000, headline: "Bitcoin consolidates as global adoption accelerates", era: "institutional" },
];

// ─── Current BTC price (last entry) ─────────────────────────
export const CURRENT_BTC_PRICE_INR = TIMELINE_EVENTS[TIMELINE_EVENTS.length - 1].btcPriceINR;

// ─── Era Metadata ────────────────────────────────────────────
export const ERA_COLORS: Record<TimelineEvent["era"], string> = {
  genesis: "#6B7280",   // gray
  early: "#3B82F6",     // blue
  growth: "#22C55E",    // green
  ban: "#EF4444",       // red
  revival: "#A855F7",   // purple
  institutional: "#F7931A", // bitcoin gold
};

export const ERA_LABELS: Record<TimelineEvent["era"], string> = {
  genesis: "Genesis",
  early: "Early Days",
  growth: "Growth",
  ban: "Indian Ban Era",
  revival: "Revival",
  institutional: "Institutional",
};

export const ERA_BG_GRADIENTS: Record<TimelineEvent["era"], string> = {
  genesis: "radial-gradient(ellipse at 50% 0%, rgba(107,114,128,0.12) 0%, transparent 70%)",
  early: "radial-gradient(ellipse at 50% 0%, rgba(59,130,246,0.10) 0%, transparent 70%)",
  growth: "radial-gradient(ellipse at 50% 0%, rgba(34,197,94,0.10) 0%, transparent 70%)",
  ban: "radial-gradient(ellipse at 50% 0%, rgba(239,68,68,0.10) 0%, transparent 70%)",
  revival: "radial-gradient(ellipse at 50% 0%, rgba(168,85,247,0.10) 0%, transparent 70%)",
  institutional: "radial-gradient(ellipse at 50% 0%, rgba(247,147,26,0.12) 0%, transparent 70%)",
};

// ─── Price Interpolation ─────────────────────────────────────

function parseDate(s: string): number {
  return new Date(s + "T00:00:00Z").getTime();
}

/**
 * Get interpolated BTC price in INR for any date between the first and last event.
 * Uses linear interpolation between the two closest known data points.
 */
export function getPriceAtDate(dateStr: string): number {
  const target = parseDate(dateStr);
  const first = TIMELINE_EVENTS[0];
  const last = TIMELINE_EVENTS[TIMELINE_EVENTS.length - 1];

  if (target <= parseDate(first.date)) return first.btcPriceINR;
  if (target >= parseDate(last.date)) return last.btcPriceINR;

  // Find bracketing events
  let lo = 0;
  let hi = TIMELINE_EVENTS.length - 1;
  for (let i = 0; i < TIMELINE_EVENTS.length - 1; i++) {
    const d = parseDate(TIMELINE_EVENTS[i].date);
    const dNext = parseDate(TIMELINE_EVENTS[i + 1].date);
    if (target >= d && target <= dNext) {
      lo = i;
      hi = i + 1;
      break;
    }
  }

  const loDate = parseDate(TIMELINE_EVENTS[lo].date);
  const hiDate = parseDate(TIMELINE_EVENTS[hi].date);
  const loPrice = TIMELINE_EVENTS[lo].btcPriceINR;
  const hiPrice = TIMELINE_EVENTS[hi].btcPriceINR;

  if (hiDate === loDate) return loPrice;

  // Linear interpolation
  const t = (target - loDate) / (hiDate - loDate);
  return loPrice + t * (hiPrice - loPrice);
}

// ─── SBP Simulation ──────────────────────────────────────────

const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;

export function simulateSBP(startDate: string, weeklyAmountINR: number): SBPSimulation {
  const startMs = parseDate(startDate);
  const endMs = parseDate(TIMELINE_EVENTS[TIMELINE_EVENTS.length - 1].date);

  let totalInvested = 0;
  let btcAccumulated = 0;
  let currentMs = startMs;

  while (currentMs <= endMs) {
    const dateStr = new Date(currentMs).toISOString().split("T")[0];
    const price = getPriceAtDate(dateStr);

    if (price > 0) {
      const btcBought = weeklyAmountINR / price;
      btcAccumulated += btcBought;
      totalInvested += weeklyAmountINR;
    } else {
      // Price is 0 (genesis era) - still invest, but BTC is essentially free
      // For realism, skip accumulation when price is 0
      totalInvested += weeklyAmountINR;
    }

    currentMs += MS_PER_WEEK;
  }

  const currentValue = btcAccumulated * CURRENT_BTC_PRICE_INR;
  const returnPct = totalInvested > 0 ? ((currentValue - totalInvested) / totalInvested) * 100 : 0;

  return {
    startDate,
    weeklyAmount: weeklyAmountINR,
    totalInvested: Math.round(totalInvested),
    currentValue: Math.round(currentValue),
    btcAccumulated: parseFloat(btcAccumulated.toFixed(8)),
    returnPct: parseFloat(returnPct.toFixed(1)),
  };
}

// ─── Helpers ─────────────────────────────────────────────────

export function formatDateNice(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00Z");
  return d.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function getErasInOrder(): TimelineEvent["era"][] {
  return ["genesis", "early", "growth", "ban", "revival", "institutional"];
}

/** Group events by era, preserving order */
export function groupByEra(): Record<TimelineEvent["era"], TimelineEvent[]> {
  const groups: Record<TimelineEvent["era"], TimelineEvent[]> = {
    genesis: [],
    early: [],
    growth: [],
    ban: [],
    revival: [],
    institutional: [],
  };
  for (const event of TIMELINE_EVENTS) {
    groups[event.era].push(event);
  }
  return groups;
}
