"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { formatINR, useStreak, useLocalStorage } from "@/lib/hooks";

// ─── Animation Variants ────────────────────────────────────────
const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: {
    transition: { staggerChildren: 0.05 },
  },
};

// ─── Demo Data ─────────────────────────────────────────────────
const DEMO_NAME = "Sunny";
const PORTFOLIO_VALUE = 340138;
const CHANGE_24H = 8450;
const CHANGE_PCT = 2.5;
const BTC_HOLDING = "0.0425 BTC";
const USDT_HOLDING = "500 USDT";
const BTC_ALLOC = 87.6;
const USDT_ALLOC = 12.4;

const BTC_PRICE = 7015000;
const USDT_PRICE = 83.0;

const SBP_MONTHLY = 5000;
const SBP_TARGET = 150000;
const SBP_INVESTED = 87500;
const SBP_STREAK = 47;

const QUICK_ACTIONS = [
  {
    label: "Buy Bitcoin",
    href: "/autopilot",
    color: "text-bitcoin",
    bgAccent: "bg-bitcoin/10",
    borderAccent: "hover:border-bitcoin/30",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 12l4 4 4-4" />
        <path d="M12 8v8" />
      </svg>
    ),
  },
  {
    label: "Send/Receive",
    href: "/portfolio",
    color: "text-accent-blue",
    bgAccent: "bg-accent-blue/10",
    borderAccent: "hover:border-accent-blue/30",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M7 16l-4-4 4-4" />
        <path d="M3 12h18" />
        <path d="M17 8l4 4-4 4" />
      </svg>
    ),
  },
  {
    label: "SBP Autopilot",
    href: "/autopilot",
    color: "text-accent-green",
    bgAccent: "bg-accent-green/10",
    borderAccent: "hover:border-accent-green/30",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M21 12a9 9 0 1 1-6.22-8.56" />
        <path d="M21 3v6h-6" />
      </svg>
    ),
  },
  {
    label: "Earn on USDT",
    href: "/portfolio",
    color: "text-accent-purple",
    bgAccent: "bg-accent-purple/10",
    borderAccent: "hover:border-accent-purple/30",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
      </svg>
    ),
  },
];

const EXPLORE_FEATURES = [
  { emoji: "🤖", title: "AI Advisor", desc: "Get personalized portfolio advice", href: "/advisor" },
  { emoji: "📊", title: "Weekly Report", desc: "See your performance summary", href: "/report" },
  { emoji: "⏳", title: "Time Machine", desc: "Explore Bitcoin's history", href: "/time-machine" },
  { emoji: "☀️", title: "Roz Ka Bitcoin", desc: "Your daily Bitcoin ritual", href: "/daily" },
  { emoji: "🪐", title: "Bitcoin Kundali", desc: "Discover your investor archetype", href: "/kundali" },
  { emoji: "👨‍👩‍👧‍👦", title: "Parivaar Vault", desc: "Family Bitcoin savings", href: "/parivaar" },
];

const RECENT_ACTIVITY = [
  { text: "SBP executed: Bought 0.00071 BTC for \u20B95,000", time: "2 hours ago", dot: "bg-accent-green" },
  { text: "USDT Earnings: +\u20B956.00 credited", time: "Yesterday", dot: "bg-accent-purple" },
  { text: "Achievement unlocked: 47-day streak!", time: "Yesterday", dot: "bg-bitcoin" },
  { text: "Referred Priya \u2014 she joined IndiaBitcoin!", time: "3 days ago", dot: "bg-accent-blue" },
  { text: "Vault Lock: 0.01 BTC locked for 6 months", time: "1 week ago", dot: "bg-text-tertiary" },
];

// ─── Helper: Format today's date ──────────────────────────────
function formatDate(): string {
  return new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ─── Page Component ────────────────────────────────────────────
export default function DashboardPage() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText("indiabitcoin.com/ref/SUNNY2024");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API not available
    }
  };

  const sbpProgress = Math.round((SBP_INVESTED / SBP_TARGET) * 100);

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-surface pt-20 pb-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            variants={stagger}
            initial="initial"
            animate="animate"
            className="flex flex-col gap-6"
          >
            {/* ── 1. Welcome Header ──────────────────────────── */}
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.5, ease }}
              className="flex flex-col gap-1 pt-4"
            >
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
                  Welcome back, {DEMO_NAME}
                </h1>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-bitcoin/10 text-bitcoin border border-bitcoin/20">
                  Demo Account
                </span>
              </div>
              <p className="text-text-secondary text-sm">{formatDate()}</p>
            </motion.div>

            {/* ── 2. Portfolio Overview Card ─────────────────── */}
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.5, ease }}
            >
              <Link href="/portfolio" className="block group">
                <div className="glass-card rounded-2xl p-6 sm:p-8 transition-all duration-300 group-hover:border-bitcoin/20">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start justify-between flex-wrap gap-2">
                      <div>
                        <p className="text-text-secondary text-sm mb-1">Total Portfolio Value</p>
                        <p className="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight">
                          {formatINR(PORTFOLIO_VALUE)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 bg-accent-green/10 px-3 py-1.5 rounded-full">
                        <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5 text-accent-green">
                          <path d="M8 3v10M4 7l4-4 4 4" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="text-accent-green text-sm font-semibold">
                          +{formatINR(CHANGE_24H)} (+{CHANGE_PCT}%)
                        </span>
                      </div>
                    </div>

                    {/* Allocation Bar */}
                    <div className="flex flex-col gap-2">
                      <div className="w-full h-2 rounded-full overflow-hidden bg-surface flex">
                        <div
                          className="h-full bg-bitcoin rounded-l-full"
                          style={{ width: `${BTC_ALLOC}%` }}
                        />
                        <div
                          className="h-full bg-accent-green rounded-r-full"
                          style={{ width: `${USDT_ALLOC}%` }}
                        />
                      </div>
                      <div className="flex items-center gap-4 text-xs text-text-secondary">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-bitcoin" />
                          {BTC_ALLOC}% BTC
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-accent-green" />
                          {USDT_ALLOC}% USDT
                        </span>
                      </div>
                    </div>

                    {/* Sub-stats */}
                    <div className="flex gap-6 pt-2 border-t border-border-subtle">
                      <div>
                        <p className="text-text-tertiary text-xs">Bitcoin</p>
                        <p className="text-text-primary font-semibold text-sm">{BTC_HOLDING}</p>
                      </div>
                      <div>
                        <p className="text-text-tertiary text-xs">Tether</p>
                        <p className="text-text-primary font-semibold text-sm">{USDT_HOLDING}</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-text-tertiary text-xs mt-4 flex items-center gap-1 group-hover:text-text-secondary transition-colors">
                    View full portfolio
                    <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3">
                      <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </p>
                </div>
              </Link>
            </motion.div>

            {/* ── 3. Quick Actions Grid ─────────────────────── */}
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.5, ease }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
            >
              {QUICK_ACTIONS.map((action) => (
                <Link key={action.label} href={action.href}>
                  <motion.div
                    variants={fadeUp}
                    transition={{ duration: 0.4, ease }}
                    className={`bg-surface-card border border-border-subtle rounded-xl p-4 sm:p-5 flex flex-col items-center gap-3 text-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${action.borderAccent}`}
                  >
                    <div className={`${action.bgAccent} ${action.color} p-3 rounded-xl`}>
                      {action.icon}
                    </div>
                    <span className="text-text-primary text-sm font-medium">{action.label}</span>
                  </motion.div>
                </Link>
              ))}
            </motion.div>

            {/* ── 4. SBP Status Card ────────────────────────── */}
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.5, ease }}
              className="bg-surface-card border border-border-subtle rounded-xl p-5 sm:p-6"
            >
              <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-green opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent-green" />
                  </span>
                  <h3 className="text-text-primary font-semibold">Your SBP is Active</h3>
                </div>
                <span className="text-text-secondary text-sm">
                  {formatINR(SBP_MONTHLY)}/month &middot; Weekly on Mondays
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex justify-between text-xs text-text-secondary mb-1.5">
                  <span>{formatINR(SBP_INVESTED)} invested</span>
                  <span>{formatINR(SBP_TARGET)} target</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-surface overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-bitcoin to-bitcoin-light transition-all duration-700"
                    style={{ width: `${sbpProgress}%` }}
                  />
                </div>
                <p className="text-text-tertiary text-xs mt-1">{sbpProgress}% of yearly target</p>
              </div>

              <div className="flex items-center justify-between flex-wrap gap-3">
                <span className="text-sm flex items-center gap-1.5">
                  <span className="text-base">🔥</span>
                  <span className="text-text-primary font-medium">{SBP_STREAK}-day streak</span>
                </span>
                <Link
                  href="/autopilot"
                  className="text-sm font-medium text-bitcoin hover:text-bitcoin-light transition-colors flex items-center gap-1"
                >
                  Manage SBP
                  <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
                    <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
            </motion.div>

            {/* ── 5. Market Snapshot ─────────────────────────── */}
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.5, ease }}
              className="bg-surface-card border border-border-subtle rounded-xl p-5 sm:p-6"
            >
              <h3 className="text-text-primary font-semibold mb-4">Market Snapshot</h3>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-bitcoin/10 flex items-center justify-center">
                    <span className="text-bitcoin font-bold text-sm">₿</span>
                  </div>
                  <div>
                    <p className="text-text-primary font-semibold">{formatINR(BTC_PRICE)}</p>
                    <p className="text-accent-green text-xs font-medium">+2.4%</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-accent-green/10 flex items-center justify-center">
                    <span className="text-accent-green font-bold text-sm">$</span>
                  </div>
                  <div>
                    <p className="text-text-primary font-semibold">{formatINR(USDT_PRICE)}</p>
                    <p className="text-accent-green text-xs font-medium">+0.01%</p>
                  </div>
                </div>
              </div>
              <p className="text-text-tertiary text-xs mt-4">Prices update every 30 seconds</p>
            </motion.div>

            {/* ── 6. Explore Features Grid ───────────────────── */}
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.5, ease }}
            >
              <h3 className="text-text-primary font-semibold mb-4">Explore Features</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                {EXPLORE_FEATURES.map((feature) => (
                  <Link key={feature.title} href={feature.href}>
                    <motion.div
                      variants={fadeUp}
                      transition={{ duration: 0.4, ease }}
                      className="bg-surface-card border border-border-subtle rounded-xl p-4 sm:p-5 h-full flex flex-col gap-2 transition-all duration-200 hover:border-bitcoin/30"
                    >
                      <span className="text-2xl">{feature.emoji}</span>
                      <h4 className="text-text-primary font-semibold text-sm">{feature.title}</h4>
                      <p className="text-text-secondary text-xs leading-relaxed">{feature.desc}</p>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* ── 7. Recent Activity Feed ────────────────────── */}
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.5, ease }}
              className="bg-surface-card border border-border-subtle rounded-xl p-5 sm:p-6"
            >
              <h3 className="text-text-primary font-semibold mb-4">Recent Activity</h3>
              <div className="flex flex-col gap-3">
                {RECENT_ACTIVITY.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 group"
                  >
                    <span className={`mt-1.5 w-2 h-2 rounded-full ${item.dot} shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-text-primary text-sm truncate">{item.text}</p>
                      <p className="text-text-tertiary text-xs">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* ── 8. Referral Banner ─────────────────────────── */}
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.5, ease }}
              className="bg-gradient-to-r from-bitcoin/10 to-bitcoin/5 border border-bitcoin/20 rounded-xl p-5 sm:p-6"
            >
              <h3 className="text-text-primary font-semibold mb-1">
                Invite friends, earn Bitcoin
              </h3>
              <p className="text-text-secondary text-sm mb-4">
                15% commission on every trade they make
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex-1 min-w-0 bg-surface/60 border border-border-subtle rounded-lg px-4 py-2.5">
                  <p className="text-text-secondary text-sm truncate font-mono">
                    indiabitcoin.com/ref/SUNNY2024
                  </p>
                </div>
                <button
                  onClick={handleCopy}
                  className="shrink-0 px-5 py-2.5 bg-bitcoin text-surface font-semibold text-sm rounded-lg hover:bg-bitcoin-dark transition-colors active:scale-95"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
