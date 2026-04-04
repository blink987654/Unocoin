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

// ─── Daily Visit Hook ────────────────────────────────────────

export function useDailyVisit() {
  const [lastVisit, setLastVisit] = useLocalStorage<string>("uno_daily_last_visit", "");
  const today = todayStr();
  const isFirstToday = lastVisit !== today;
  const markVisited = useCallback(() => setLastVisit(today), [today, setLastVisit]);
  return { isFirstToday, markVisited };
}

// ─── Speech Synthesis Hook ───────────────────────────────────

export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = useCallback((text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1;
    // Prefer en-IN voice
    const voices = window.speechSynthesis.getVoices();
    const indianVoice = voices.find((v) => v.lang.startsWith("en-IN") || v.lang.startsWith("en_IN"));
    if (indianVoice) utterance.voice = indianVoice;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return { speak, stop, isSpeaking };
}

// ─── Animated Counter Hook ───────────────────────────────────

export function useAnimatedCounter(target: number, duration = 2000) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let raf: number;
    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

// ─── Bazaar Insights Hook ────────────────────────────────────

import type { BazaarCache } from "@/lib/types";

export function useBazaarInsights() {
  const [cache, setCache] = useLocalStorage<BazaarCache>("uno_bazaar_cache", {
    insights: [], fetchedAt: 0, sessionCount: 0,
  });
  const [dismissed, setDismissed] = useLocalStorage<string[]>("uno_bazaar_dismissed", []);

  const canShow = cache.sessionCount < 3;
  const isStale = Date.now() - cache.fetchedAt > 3600000;

  const fetchInsights = useCallback(async (context: string, portfolio: Record<string, unknown>) => {
    if (!canShow && !isStale) return cache.insights;
    try {
      const res = await fetch("/api/bazaar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page: context, portfolio }),
      });
      if (!res.ok) return cache.insights;
      const data = await res.json();
      setCache({
        insights: data.insights || [],
        fetchedAt: Date.now(),
        sessionCount: isStale ? 1 : cache.sessionCount + 1,
      });
      return data.insights || [];
    } catch {
      return cache.insights;
    }
  }, [canShow, isStale, cache, setCache]);

  const dismissInsight = useCallback((id: string) => {
    setDismissed((prev) => [...prev, id]);
  }, [setDismissed]);

  const activeInsights = cache.insights.filter((i) => !dismissed.includes(i.id));

  return { insights: activeInsights, fetchInsights, dismissInsight, canShow };
}

// ─── Family Vault Hook ───────────────────────────────────────

import type { FamilyMember, FamilyGoal, FamilyGift, FamilyActivity } from "@/lib/types";

const DEFAULT_FAMILY: FamilyMember[] = [
  { id: "papa", name: "Papa", role: "Papa", avatar: "👨", contribution: 120000, streak: 45, joinedAt: "2023-06-15" },
  { id: "mummy", name: "Mummy", role: "Mummy", avatar: "👩", contribution: 80000, streak: 30, joinedAt: "2023-08-01" },
  { id: "beta", name: "Arjun", role: "Beta", avatar: "👦", contribution: 25000, streak: 12, joinedAt: "2024-01-10" },
  { id: "didi", name: "Priya", role: "Beti", avatar: "👧", contribution: 40000, streak: 22, joinedAt: "2023-11-20" },
  { id: "dada", name: "Dada Ji", role: "Dada", avatar: "👴", contribution: 60000, streak: 8, joinedAt: "2024-03-01" },
];

const DEFAULT_GOALS: FamilyGoal[] = [
  { id: "shaadi", name: "Beti ki Shaadi Fund", targetAmount: 1000000, currentAmount: 420000, icon: "💒" },
];

export function useFamilyVault() {
  const [members, setMembers] = useLocalStorage<FamilyMember[]>("uno_parivaar_members", DEFAULT_FAMILY);
  const [goals, setGoals] = useLocalStorage<FamilyGoal[]>("uno_parivaar_goals", DEFAULT_GOALS);
  const [gifts, setGifts] = useLocalStorage<FamilyGift[]>("uno_parivaar_gifts", []);
  const [activities, setActivities] = useLocalStorage<FamilyActivity[]>("uno_parivaar_activity", []);

  const totalValue = members.reduce((sum, m) => sum + m.contribution, 0);

  const addGift = useCallback((gift: FamilyGift) => {
    setGifts((prev) => [gift, ...prev]);
    setActivities((prev) => [{
      id: Date.now().toString(),
      memberId: gift.from,
      memberName: gift.from,
      action: `gifted ₹${gift.amount.toLocaleString("en-IN")} to ${gift.to}`,
      amount: gift.amount,
      timestamp: Date.now(),
    }, ...prev]);
  }, [setGifts, setActivities]);

  return { members, setMembers, goals, setGoals, gifts, addGift, activities, setActivities, totalValue };
}
