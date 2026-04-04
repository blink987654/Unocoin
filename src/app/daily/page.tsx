"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import {
  useDailyVisit,
  useSpeechSynthesis,
  useStreak,
  useAnimatedCounter,
  formatINR,
  useLocalStorage,
} from "@/lib/hooks";
import type { DailyBriefing, CommunityPoll } from "@/lib/types";

// ─── Constants ───────────────────────────────────────────────

const EASE_SMOOTH: [number, number, number, number] = [0.16, 1, 0.3, 1];

const HINDI_DAYS = [
  "Ravivar",
  "Somvar",
  "Mangalvar",
  "Budhvar",
  "Guruvar",
  "Shukravar",
  "Shanivar",
];

const HINDI_MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function formatHindiDate(date: Date): string {
  const day = HINDI_DAYS[date.getDay()];
  const d = date.getDate();
  const month = HINDI_MONTHS[date.getMonth()];
  const year = date.getFullYear();
  return `${day}, ${d} ${month} ${year}`;
}

function todayStr(): string {
  return new Date().toISOString().split("T")[0];
}

// ─── Chai Cup SVG Component ─────────────────────────────────

function ChaiCup({ filled }: { filled: boolean }) {
  return (
    <div className="relative mx-auto w-20 h-20">
      <svg
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Cup body */}
        <path
          d="M16 24 H54 L50 68 H20 Z"
          stroke="currentColor"
          strokeWidth="2"
          className="text-text-tertiary"
          fill="none"
        />
        {/* Handle */}
        <path
          d="M54 32 C66 32 66 52 54 52"
          stroke="currentColor"
          strokeWidth="2"
          className="text-text-tertiary"
          fill="none"
        />
        {/* Saucer */}
        <ellipse
          cx="35"
          cy="70"
          rx="24"
          ry="4"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-text-tertiary"
          fill="none"
        />
        {/* Chai liquid fill */}
        <path
          d="M18 30 H52 L50 66 H22 Z"
          className={`text-bitcoin ${filled ? "animate-chai-fill" : ""}`}
          fill="currentColor"
          opacity={filled ? 0.9 : 0}
          style={{
            clipPath: filled ? undefined : "inset(100% 0 0 0)",
          }}
        />
        {/* Steam lines */}
        {filled && (
          <>
            <path
              d="M28 20 C28 14 32 16 32 10"
              stroke="currentColor"
              strokeWidth="1"
              className="text-text-tertiary animate-morning-glow"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M38 18 C38 12 42 14 42 8"
              stroke="currentColor"
              strokeWidth="1"
              className="text-text-tertiary animate-morning-glow"
              fill="none"
              strokeLinecap="round"
            />
          </>
        )}
      </svg>
    </div>
  );
}

// ─── Shimmer Loading Placeholder ────────────────────────────

function ShimmerBlock({ className }: { className?: string }) {
  return (
    <div
      className={`rounded-lg bg-gradient-to-r from-surface-card via-surface-elevated to-surface-card bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite] ${className ?? ""}`}
    />
  );
}

// ─── Main Page ──────────────────────────────────────────────

export default function DailyPage() {
  const [briefing, setBriefing] = useLocalStorage<DailyBriefing | null>(
    "uno_daily_briefing",
    null
  );
  const [loading, setLoading] = useState(false);
  const [voted, setVoted] = useState<0 | 1 | null>(null);

  const streak = useStreak("uno_daily_streak");
  const animatedStreak = useAnimatedCounter(streak.count, 1500);
  const { markVisited } = useDailyVisit();
  const { speak, stop, isSpeaking } = useSpeechSynthesis();

  const now = new Date();
  const dateLabel = formatHindiDate(now);
  const today = todayStr();

  // Determine if we need a fresh briefing
  const needsFetch = !briefing || briefing.date !== today;

  // Fetch briefing from API
  const fetchBriefing = useCallback(async () => {
    setLoading(true);
    try {
      const btcChange24h = parseFloat(
        (Math.random() * 10 - 5).toFixed(1)
      );
      const res = await fetch("/api/daily-briefing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          portfolioValue: 340138,
          btcChange24h,
        }),
      });
      if (res.ok) {
        const data: DailyBriefing = await res.json();
        setBriefing(data);
        setVoted(data.communityPoll.userVote ?? null);
      }
    } catch {
      // Silently fail — user sees cached or empty state
    } finally {
      setLoading(false);
    }
  }, [setBriefing]);

  // On mount: mark visit, mark streak, fetch if needed
  useEffect(() => {
    streak.markToday();
    markVisited();
    if (needsFetch) {
      fetchBriefing();
    } else if (briefing?.communityPoll.userVote != null) {
      setVoted(briefing.communityPoll.userVote);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle poll vote
  const handleVote = (option: 0 | 1) => {
    if (voted !== null || !briefing) return;
    setVoted(option);
    const updatedPoll: CommunityPoll = {
      ...briefing.communityPoll,
      votes: [
        briefing.communityPoll.votes[0] + (option === 0 ? 1 : 0),
        briefing.communityPoll.votes[1] + (option === 1 ? 1 : 0),
      ],
      userVote: option,
    };
    setBriefing({ ...briefing, communityPoll: updatedPoll });
  };

  // Poll helpers
  const poll = briefing?.communityPoll;
  const totalVotes = poll ? poll.votes[0] + poll.votes[1] : 0;
  const pct0 = totalVotes > 0 && poll ? Math.round((poll.votes[0] / totalVotes) * 100) : 50;
  const pct1 = totalVotes > 0 ? 100 - pct0 : 50;

  const btcChange = briefing?.btcChange24h ?? 0;
  const isPositive = btcChange >= 0;

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-surface text-text-primary">
        {/* ── Hero Section ─────────────────────────────────── */}
        <section className="relative pt-28 pb-12 overflow-hidden">
          {/* Morning glow background */}
          <div
            className="absolute inset-0 animate-morning-glow pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 60% 40% at 50% 30%, rgba(247,147,26,0.08) 0%, transparent 70%)",
            }}
          />

          <div className="relative max-w-2xl mx-auto px-4 text-center">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE_SMOOTH }}
              className="text-text-secondary text-sm tracking-wide mb-3"
            >
              {dateLabel}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE_SMOOTH, delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold mb-2"
            >
              <span className="text-bitcoin">Roz Ka Bitcoin</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="text-text-secondary text-lg"
            >
              Your daily Bitcoin ritual
            </motion.p>

            {/* Chai Cup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: EASE_SMOOTH, delay: 0.35 }}
              className="mt-8"
            >
              <ChaiCup filled={!loading && briefing !== null} />
            </motion.div>
          </div>
        </section>

        <div className="max-w-2xl mx-auto px-4 space-y-8 pb-20">
          {/* ── Daily Briefing Card ───────────────────────── */}
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_SMOOTH, delay: 0.4 }}
          >
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Morning Briefing</h2>
                {briefing && (
                  <button
                    onClick={() =>
                      isSpeaking ? stop() : speak(briefing.greeting)
                    }
                    className="flex items-center gap-2 text-sm text-text-secondary hover:text-bitcoin transition-colors px-3 py-1.5 rounded-lg hover:bg-surface-elevated"
                    aria-label={isSpeaking ? "Stop reading" : "Listen to briefing"}
                  >
                    {isSpeaking ? (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <rect x="3" y="3" width="10" height="10" rx="1" />
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8 1a.5.5 0 0 1 .5.5v13a.5.5 0 0 1-.78.42L3.5 12H1.5A.5.5 0 0 1 1 11.5v-7A.5.5 0 0 1 1.5 4h2l4.22-2.92A.5.5 0 0 1 8 1.5v0zM11.5 5a.5.5 0 0 1 .35.85 4.48 4.48 0 0 1 0 4.3.5.5 0 0 1-.7-.7 3.48 3.48 0 0 0 0-2.9.5.5 0 0 1 .35-.55z" />
                        <path d="M13.5 3a.5.5 0 0 1 .33.87 7.48 7.48 0 0 1 0 8.26.5.5 0 0 1-.83-.56 6.48 6.48 0 0 0 0-7.14A.5.5 0 0 1 13.5 3z" />
                      </svg>
                    )}
                    <span>{isSpeaking ? "Stop" : "Listen"}</span>
                  </button>
                )}
              </div>

              {loading ? (
                <div className="space-y-3">
                  <ShimmerBlock className="h-4 w-3/4" />
                  <ShimmerBlock className="h-4 w-full" />
                  <ShimmerBlock className="h-4 w-5/6" />
                  <ShimmerBlock className="h-4 w-2/3" />
                </div>
              ) : briefing ? (
                <p className="text-text-secondary leading-relaxed whitespace-pre-line">
                  {briefing.greeting}
                </p>
              ) : (
                <p className="text-text-tertiary italic">
                  Could not load today&apos;s briefing. Pull down to refresh.
                </p>
              )}
            </div>
          </motion.section>

          {/* ── Portfolio Snapshot ────────────────────────── */}
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_SMOOTH, delay: 0.5 }}
          >
            <h2 className="text-lg font-semibold mb-4">Portfolio Snapshot</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="glass-card rounded-xl p-4">
                <p className="text-text-tertiary text-xs uppercase tracking-wide mb-1">
                  Portfolio Value
                </p>
                <p className="text-xl font-bold">
                  {formatINR(briefing?.portfolioValue ?? 340138)}
                </p>
              </div>

              <div className="glass-card rounded-xl p-4">
                <p className="text-text-tertiary text-xs uppercase tracking-wide mb-1">
                  24h BTC Change
                </p>
                <p
                  className={`text-xl font-bold ${
                    isPositive ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {isPositive ? "+" : ""}
                  {btcChange.toFixed(1)}%
                </p>
              </div>

              <div className="glass-card rounded-xl p-4">
                <p className="text-text-tertiary text-xs uppercase tracking-wide mb-1">
                  Weekly SBP
                </p>
                <p className="text-xl font-bold">
                  {formatINR(briefing?.sipAmount ?? 500)}/week
                </p>
              </div>

              <div className="glass-card rounded-xl p-4">
                <p className="text-text-tertiary text-xs uppercase tracking-wide mb-1">
                  Daily Streak
                </p>
                <p className="text-xl font-bold">
                  {streak.isActive && streak.count > 0 ? (
                    <span>
                      {animatedStreak} day{streak.count !== 1 ? "s" : ""}
                    </span>
                  ) : (
                    <span className="text-text-tertiary">--</span>
                  )}
                </p>
              </div>
            </div>
          </motion.section>

          {/* ── Community Poll ────────────────────────────── */}
          <AnimatePresence>
            {poll && (
              <motion.section
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE_SMOOTH, delay: 0.6 }}
              >
                <h2 className="text-lg font-semibold mb-4">Community Poll</h2>
                <div className="glass-card rounded-2xl p-6">
                  <p className="text-text-primary font-medium mb-5">
                    {poll.question}
                  </p>

                  {voted === null ? (
                    <div className="grid grid-cols-2 gap-3">
                      {poll.options.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => handleVote(i as 0 | 1)}
                          className="px-4 py-3 rounded-xl border border-border-subtle bg-surface-elevated hover:border-bitcoin hover:text-bitcoin transition-all text-sm font-medium text-text-secondary"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, ease: EASE_SMOOTH }}
                      className="space-y-3"
                    >
                      {poll.options.map((opt, i) => {
                        const pct = i === 0 ? pct0 : pct1;
                        const isSelected = voted === i;
                        return (
                          <div key={i}>
                            <div className="flex items-center justify-between text-sm mb-1.5">
                              <span
                                className={
                                  isSelected
                                    ? "text-bitcoin font-medium"
                                    : "text-text-secondary"
                                }
                              >
                                {opt}
                                {isSelected && " (your vote)"}
                              </span>
                              <span className="text-text-tertiary">{pct}%</span>
                            </div>
                            <div className="h-2 rounded-full bg-surface-elevated overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={{
                                  duration: 0.8,
                                  ease: EASE_SMOOTH,
                                  delay: 0.15 * i,
                                }}
                                className={`h-full rounded-full ${
                                  isSelected
                                    ? "bg-bitcoin"
                                    : "bg-text-tertiary/40"
                                }`}
                              />
                            </div>
                          </div>
                        );
                      })}
                      <p className="text-text-tertiary text-xs pt-1">
                        {totalVotes.toLocaleString("en-IN")} votes
                      </p>
                    </motion.div>
                  )}
                </div>
              </motion.section>
            )}
          </AnimatePresence>

          {/* ── Streak Section ────────────────────────────── */}
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_SMOOTH, delay: 0.7 }}
            className="text-center"
          >
            <div className="glass-card rounded-2xl p-8">
              <div className="text-5xl mb-3">
                {streak.isActive && streak.count >= 3 ? (
                  <span role="img" aria-label="fire">
                    🔥
                  </span>
                ) : (
                  <span role="img" aria-label="sunrise">
                    🌅
                  </span>
                )}
              </div>

              <p className="text-4xl font-bold mb-1">
                Day {animatedStreak}
              </p>

              <p className="text-text-secondary text-sm">
                {streak.count === 0
                  ? "Start your daily ritual today"
                  : streak.count === 1
                    ? "You started your streak today!"
                    : `${streak.count}-day streak and counting`}
              </p>

              {streak.longestStreak > 1 && (
                <p className="text-text-tertiary text-xs mt-2">
                  Longest streak: {streak.longestStreak} days
                </p>
              )}
            </div>
          </motion.section>

          {/* ── CTA Section ───────────────────────────────── */}
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_SMOOTH, delay: 0.8 }}
            className="text-center pb-8"
          >
            <p className="text-text-secondary text-sm mb-4">
              Build the habit. Stack sats daily with a Systematic Bitcoin Plan.
            </p>
            <Link
              href="/autopilot"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-bitcoin text-surface font-semibold hover:brightness-110 transition-all"
            >
              Set up your daily SBP
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </motion.section>
        </div>
      </main>
      <Footer />
    </>
  );
}
