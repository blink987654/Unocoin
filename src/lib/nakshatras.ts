import type { Nakshatra, NakshatraId } from "@/lib/types";

// ─── 12 Bitcoin Investor Nakshatras ─────────────────────────
// Each archetype maps to a distinct investment personality

export const NAKSHATRAS: Record<NakshatraId, Nakshatra> = {
  dhruv: {
    id: "dhruv",
    name: "Dhruv",
    title: "The Pole Star HODLer",
    emoji: "⭐",
    color: "#F7931A",
    description:
      "Unwavering conviction. You bought and never looked back. Like Dhruv Tara, you are the fixed point others navigate by. Your patience is your greatest asset.",
  },
  vajra: {
    id: "vajra",
    name: "Vajra",
    title: "The Diamond Hands",
    emoji: "💎",
    color: "#3B82F6",
    description:
      "Forged under pressure, unbreakable in storms. You've held through every crash and emerged stronger. Your grip on conviction is legendary.",
  },
  agni: {
    id: "agni",
    name: "Agni",
    title: "The Fire Trader",
    emoji: "🔥",
    color: "#EF4444",
    description:
      "Passionate and quick to act. You thrive on volatility and see opportunity where others see chaos. Your energy lights up the market.",
  },
  samudra: {
    id: "samudra",
    name: "Samudra",
    title: "The Deep Ocean Accumulator",
    emoji: "🌊",
    color: "#06B6D4",
    description:
      "Calm on the surface, vast in depth. You accumulate quietly, methodically, week after week. Your SBP strategy runs like the tides — steady and unstoppable.",
  },
  surya: {
    id: "surya",
    name: "Surya",
    title: "The Solar Maximalist",
    emoji: "☀️",
    color: "#FBBF24",
    description:
      "Radiant conviction in Bitcoin's future. You see it as the center of a new financial solar system. Your optimism inspires everyone around you.",
  },
  chandra: {
    id: "chandra",
    name: "Chandra",
    title: "The Lunar Cycler",
    emoji: "🌙",
    color: "#A855F7",
    description:
      "You understand cycles like no one else. Buy in the dark of bear markets, take profits in the full moon of bull runs. Timing is your art.",
  },
  vayu: {
    id: "vayu",
    name: "Vayu",
    title: "The Swift Adopter",
    emoji: "💨",
    color: "#10B981",
    description:
      "First to try Lightning, first to set up SBP, first to share with family. You move fast and spread Bitcoin adoption like the wind.",
  },
  prithvi: {
    id: "prithvi",
    name: "Prithvi",
    title: "The Grounded Builder",
    emoji: "🌍",
    color: "#84CC16",
    description:
      "Practical, methodical, and rooted in fundamentals. You don't chase pumps — you build wealth slowly, like the earth builds mountains.",
  },
  akasha: {
    id: "akasha",
    name: "Akasha",
    title: "The Cosmic Visionary",
    emoji: "✨",
    color: "#8B5CF6",
    description:
      "You see the big picture — hyperbitcoinization, sound money, generational wealth. Others call you dreamer; you call it seeing the inevitable.",
  },
  indra: {
    id: "indra",
    name: "Indra",
    title: "The Thunderbolt Strategist",
    emoji: "⚡",
    color: "#F59E0B",
    description:
      "Decisive and powerful. When you strike, you strike big. Your lump-sum buys during crashes are the stuff of legend. Fortune favors the bold.",
  },
  ratna: {
    id: "ratna",
    name: "Ratna",
    title: "The Gem Collector",
    emoji: "💰",
    color: "#EC4899",
    description:
      "You appreciate Bitcoin as digital gold — precious, scarce, and beautiful. Your portfolio is curated with care, each satoshi a gem in your vault.",
  },
  kala: {
    id: "kala",
    name: "Kala",
    title: "The Time Master",
    emoji: "⏳",
    color: "#6366F1",
    description:
      "You understand that time in the market beats timing the market. Your secret weapon? Starting early and never stopping. Time is your greatest ally.",
  },
};

export const NAKSHATRA_IDS: NakshatraId[] = [
  "dhruv", "vajra", "agni", "samudra", "surya", "chandra",
  "vayu", "prithvi", "akasha", "indra", "ratna", "kala",
];

export function getNakshatra(id: NakshatraId): Nakshatra {
  return NAKSHATRAS[id];
}
