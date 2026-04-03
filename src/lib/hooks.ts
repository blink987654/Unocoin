"use client";

import { useState, useEffect, useCallback } from "react";

// ─── Generic localStorage Hook ────────────────────────────────

export function useLocalStorage<T>(key: string, defaultValue: T): [T, (val: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return defaultValue;
    try {
      const stored = localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage full or unavailable
    }
  }, [key, value]);

  return [value, setValue];
}

// ─── Streak Hook ──────────────────────────────────────────────

interface StreakData {
  count: number;
  lastDate: string; // YYYY-MM-DD
  longestStreak: number;
  startDate: string;
}

function todayStr(): string {
  return new Date().toISOString().split("T")[0];
}

function yesterdayStr(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
}

export function useStreak(key: string) {
  const [data, setData] = useLocalStorage<StreakData>(key, {
    count: 0,
    lastDate: "",
    longestStreak: 0,
    startDate: "",
  });

  const markToday = useCallback(() => {
    const today = todayStr();
    setData((prev) => {
      if (prev.lastDate === today) return prev; // Already marked
      const yesterday = yesterdayStr();
      const isConsecutive = prev.lastDate === yesterday;
      const newCount = isConsecutive ? prev.count + 1 : 1;
      return {
        count: newCount,
        lastDate: today,
        longestStreak: Math.max(prev.longestStreak, newCount),
        startDate: isConsecutive ? prev.startDate : today,
      };
    });
  }, [setData]);

  const isActive = data.lastDate === todayStr() || data.lastDate === yesterdayStr();

  return {
    count: data.count,
    isActive,
    longestStreak: data.longestStreak,
    markToday,
  };
}

// ─── Achievements Hook ────────────────────────────────────────

export const ACHIEVEMENT_DEFS = [
  { id: "first_step", title: "First Step", description: "Visited your portfolio", icon: "👣" },
  { id: "digital_gold", title: "Digital Gold", description: "Hold Bitcoin in your portfolio", icon: "🥇" },
  { id: "lightning_fast", title: "Lightning Fast", description: "Made a Lightning transaction", icon: "⚡" },
  { id: "diamond_hands", title: "Diamond Hands", description: "Locked Bitcoin in the vault", icon: "💎" },
  { id: "streak_7", title: "On Fire", description: "7-day SBP streak", icon: "🔥" },
  { id: "streak_30", title: "Streak Master", description: "30-day SBP streak", icon: "🏆" },
  { id: "streak_100", title: "Century Club", description: "100-day SBP streak", icon: "💯" },
  { id: "goal_setter", title: "Goal Setter", description: "Created a savings goal", icon: "🎯" },
  { id: "halfway", title: "Halfway There", description: "Reached 50% of a goal", icon: "⏳" },
  { id: "whale_watch", title: "Whale Watch", description: "Portfolio exceeded ₹1L", icon: "🐋" },
  { id: "diversified", title: "Diversified", description: "Hold 3+ different assets", icon: "🌈" },
  { id: "night_owl", title: "Night Owl", description: "Visited between midnight and 5am", icon: "🦉" },
  { id: "early_bird", title: "Early Bird", description: "Visited before 7am", icon: "🐦" },
  { id: "social_butterfly", title: "Social Butterfly", description: "Copied your referral link", icon: "🦋" },
  { id: "btc_maxi", title: "Bitcoin Maximalist", description: "BTC allocation over 80%", icon: "₿" },
] as const;

export type AchievementId = (typeof ACHIEVEMENT_DEFS)[number]["id"];

export function useAchievements() {
  const [unlocked, setUnlocked] = useLocalStorage<Record<string, boolean>>("uno_achievements", {});
  const [newlyUnlocked, setNewlyUnlocked] = useState<string | null>(null);

  const unlock = useCallback(
    (id: AchievementId) => {
      setUnlocked((prev) => {
        if (prev[id]) return prev;
        setNewlyUnlocked(id);
        return { ...prev, [id]: true };
      });
    },
    [setUnlocked]
  );

  const isUnlocked = useCallback((id: AchievementId) => !!unlocked[id], [unlocked]);

  const dismissToast = useCallback(() => setNewlyUnlocked(null), []);

  const totalUnlocked = Object.values(unlocked).filter(Boolean).length;

  return { unlocked, unlock, isUnlocked, newlyUnlocked, dismissToast, totalUnlocked };
}

// ─── Format INR ───────────────────────────────────────────────

export function formatINR(n: number): string {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)} L`;
  return `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}
