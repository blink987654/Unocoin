"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AchievementToast from "@/components/AchievementToast";
import { useStreak, useAchievements, useLocalStorage, formatINR } from "@/lib/hooks";
import type { SavingsGoal, VaultLock, ReferralFriend } from "@/lib/types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Tab = "overview" | "holdings" | "sbps" | "transactions" | "goals";

interface Holding {
  asset: string;
  qty: string;
  avgPrice: string;
  currentPrice: string;
  value: number;
  valueFmt: string;
  pnl: string;
  pnlPct: string;
  pnlPositive: boolean;
  pnlNeutral: boolean;
  allocation: number;
  color: string;
  colorClass: string;
}

interface Transaction {
  label: string;
  detail: string;
  time: string;
  badge?: string;
  badgeColor?: string;
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const TOTAL_VALUE = 482350;

const holdings: Holding[] = [
  {
    asset: "BTC", qty: "0.0425", avgPrice: "₹58,00,000", currentPrice: "₹70,15,000",
    value: 298138, valueFmt: "₹2,98,138", pnl: "+₹51,638", pnlPct: "+20.9%",
    pnlPositive: true, pnlNeutral: false, allocation: 61.8, color: "#F7931A", colorClass: "text-bitcoin",
  },
  {
    asset: "ETH", qty: "0.85", avgPrice: "₹2,10,000", currentPrice: "₹2,70,000",
    value: 112500, valueFmt: "₹1,12,500", pnl: "+₹25,500", pnlPct: "+29.3%",
    pnlPositive: true, pnlNeutral: false, allocation: 23.3, color: "#8B5CF6", colorClass: "text-accent-purple",
  },
  {
    asset: "USDT", qty: "500", avgPrice: "₹84.0", currentPrice: "₹84.0",
    value: 42000, valueFmt: "₹42,000", pnl: "₹0", pnlPct: "0%",
    pnlPositive: false, pnlNeutral: true, allocation: 8.7, color: "#22C55E", colorClass: "text-accent-green",
  },
  {
    asset: "SOL", qty: "2.5", avgPrice: "₹8,400", currentPrice: "₹11,885",
    value: 29712, valueFmt: "₹29,712", pnl: "+₹8,712", pnlPct: "+41.5%",
    pnlPositive: true, pnlNeutral: false, allocation: 6.2, color: "#3B82F6", colorClass: "text-accent-blue",
  },
];

const transactions: Transaction[] = [
  { label: "Bought 0.002 BTC", detail: "₹14,030", time: "2 hours ago", badge: "SBP", badgeColor: "bg-bitcoin/20 text-bitcoin" },
  { label: "Received 0.5 ETH", detail: "Lightning", time: "1 day ago", badge: "Lightning", badgeColor: "bg-accent-purple/20 text-accent-purple" },
  { label: "Sold 100 USDT", detail: "₹8,400", time: "3 days ago" },
  { label: "SBP Buy 0.001 BTC", detail: "₹7,015", time: "1 week ago", badge: "Auto", badgeColor: "bg-accent-green/20 text-accent-green" },
  { label: "Withdrew ₹25,000", detail: "HDFC Bank", time: "2 weeks ago" },
];

const tabs: { key: Tab; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "holdings", label: "Holdings" },
  { key: "sbps", label: "SBPs" },
  { key: "transactions", label: "Transactions" },
  { key: "goals", label: "Goals" },
];

const DEMO_REFERRALS: ReferralFriend[] = [
  { name: "Priya S.", joined: "Jan 2024", totalTraded: 125000, yourEarnings: 375 },
  { name: "Rahul M.", joined: "Feb 2024", totalTraded: 89000, yourEarnings: 267 },
  { name: "Anita K.", joined: "Mar 2024", totalTraded: 210000, yourEarnings: 630 },
  { name: "Vikram P.", joined: "Apr 2024", totalTraded: 45000, yourEarnings: 135 },
  { name: "Sneha D.", joined: "May 2024", totalTraded: 178000, yourEarnings: 534 },
];

// ---------------------------------------------------------------------------
// Animated Counter Hook
// ---------------------------------------------------------------------------

function useCountUp(target: number, duration = 2000) {
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

// ---------------------------------------------------------------------------
// SBP Streak Counter
// ---------------------------------------------------------------------------

function StreakCounter() {
  const { count, isActive, longestStreak, markToday } = useStreak("uno_streak_sbp");

  useEffect(() => { markToday(); }, [markToday]);

  const milestones = [
    { days: 7, label: "Week", icon: "🔥" },
    { days: 30, label: "Month", icon: "🏆" },
    { days: 100, label: "Century", icon: "💯" },
  ];
  const topPct = Math.max(1, Math.round(100 - count * 0.5));

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-bitcoin/10 via-surface-card to-surface-card rounded-2xl border border-bitcoin/20 p-5"
    >
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <span className={`text-4xl ${isActive ? "animate-streak-flame" : "opacity-50"}`}>🔥</span>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-mono text-text-primary">Day {count}</span>
              {isActive && (
                <span className="text-xs bg-accent-green/20 text-accent-green px-2 py-0.5 rounded-full font-medium">Active</span>
              )}
            </div>
            <p className="text-text-tertiary text-sm mt-0.5">
              SBP Streak · Top {topPct}% of investors · Best: {longestStreak} days
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {milestones.map((m) => (
            <div
              key={m.days}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border ${
                count >= m.days
                  ? "bg-bitcoin/15 border-bitcoin/30 text-bitcoin"
                  : "bg-surface-elevated border-border-subtle text-text-tertiary"
              }`}
            >
              <span>{m.icon}</span>
              <span>{m.label}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Donut Chart
// ---------------------------------------------------------------------------

function DonutChart({ data }: { data: Holding[] }) {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  let cumulativeOffset = 0;

  return (
    <div className="flex flex-col items-center gap-6">
      <svg viewBox="0 0 200 200" className="w-48 h-48 -rotate-90">
        {data.map((h) => {
          const dash = (h.allocation / 100) * circumference;
          const offset = circumference - cumulativeOffset;
          cumulativeOffset += dash;
          return (
            <circle key={h.asset} cx="100" cy="100" r={radius} fill="none"
              stroke={h.color} strokeWidth="25"
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={offset} strokeLinecap="round"
              className="transition-all duration-700"
            />
          );
        })}
        <text x="100" y="100" textAnchor="middle" dominantBaseline="central"
          className="fill-text-primary text-[11px] font-semibold rotate-90 origin-center">
          ₹4.8L
        </text>
      </svg>
      <div className="grid grid-cols-2 gap-x-6 gap-y-2">
        {data.map((h) => (
          <div key={h.asset} className="flex items-center gap-2 text-sm">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: h.color }} />
            <span className="text-text-secondary">{h.asset}</span>
            <span className="font-mono text-text-primary ml-auto">{h.allocation}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Holdings Table
// ---------------------------------------------------------------------------

function HoldingsTable() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-surface-card rounded-2xl border border-border-subtle overflow-hidden">
      <div className="px-6 py-4 border-b border-border-subtle">
        <h3 className="text-lg font-semibold text-text-primary">Holdings</h3>
      </div>
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-text-tertiary text-xs uppercase tracking-wider">
              <th className="text-left px-6 py-3 font-medium">Asset</th>
              <th className="text-right px-4 py-3 font-medium">Quantity</th>
              <th className="text-right px-4 py-3 font-medium">Avg Price</th>
              <th className="text-right px-4 py-3 font-medium">Current Price</th>
              <th className="text-right px-4 py-3 font-medium">Value</th>
              <th className="text-right px-4 py-3 font-medium">P&L</th>
              <th className="text-right px-6 py-3 font-medium">Allocation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {holdings.map((h) => (
              <tr key={h.asset} className="hover:bg-surface-elevated/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: h.color }} />
                    <span className="font-semibold text-text-primary">{h.asset}</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-right font-mono text-text-primary">{h.qty}</td>
                <td className="px-4 py-4 text-right font-mono text-text-secondary">{h.avgPrice}</td>
                <td className="px-4 py-4 text-right font-mono text-text-primary">{h.currentPrice}</td>
                <td className="px-4 py-4 text-right font-mono text-text-primary font-semibold">{h.valueFmt}</td>
                <td className="px-4 py-4 text-right font-mono">
                  <span className={h.pnlNeutral ? "text-text-secondary" : h.pnlPositive ? "text-green-400" : "text-red-400"}>
                    {h.pnl} ({h.pnlPct})
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-mono text-text-secondary">{h.allocation}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="md:hidden divide-y divide-border-subtle">
        {holdings.map((h) => (
          <div key={h.asset} className="px-4 py-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: h.color }} />
                <span className="font-semibold text-text-primary">{h.asset}</span>
                <span className="text-text-tertiary text-xs font-mono">{h.qty}</span>
              </div>
              <span className="font-mono font-semibold text-text-primary">{h.valueFmt}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-tertiary">Avg {h.avgPrice} &rarr; {h.currentPrice}</span>
              <span className={h.pnlNeutral ? "text-text-secondary font-mono" : h.pnlPositive ? "text-green-400 font-mono" : "text-red-400 font-mono"}>
                {h.pnl} ({h.pnlPct})
              </span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Summary Cards (with Portfolio Pulse)
// ---------------------------------------------------------------------------

function SummaryCards({ lastValue }: { lastValue: number }) {
  const totalValue = useCountUp(TOTAL_VALUE, 2000);
  const isUp = TOTAL_VALUE >= lastValue;

  const cards = [
    { label: "Total Value", value: `₹${totalValue.toLocaleString("en-IN")}`, sub: null, color: "text-text-primary" },
    { label: "24h Change", value: "+₹12,450", sub: "+2.6%", color: "text-green-400" },
    { label: "Total Invested", value: "₹3,50,000", sub: null, color: "text-text-primary" },
    { label: "Total Returns", value: "₹1,32,350", sub: "+37.8%", color: "text-green-400" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c, i) => (
        <motion.div key={c.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.08 }}
          className={`bg-surface-card rounded-2xl border border-border-subtle p-5 ${
            i === 0 ? (isUp ? "shadow-[0_0_30px_rgba(34,197,94,0.1)]" : "shadow-[0_0_30px_rgba(239,68,68,0.1)]") : ""
          }`}>
          <p className="text-text-tertiary text-sm mb-1">{c.label}</p>
          <p className={`text-2xl font-bold font-mono ${c.color}`}>{c.value}</p>
          {c.sub && <span className="text-sm font-mono text-green-400">{c.sub}</span>}
        </motion.div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// SBP Cards
// ---------------------------------------------------------------------------

function SBPCards() {
  const sbps = [
    { asset: "BTC", amount: "₹2,000/week", since: "Jan 2024", invested: "₹2,08,000", progress: 65, color: "#F7931A" },
    { asset: "ETH", amount: "₹500/week", since: "Mar 2024", invested: "₹52,000", progress: 40, color: "#8B5CF6" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {sbps.map((s, i) => (
        <motion.div key={s.asset} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
          className="bg-surface-card rounded-2xl border border-border-subtle p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
              <h4 className="text-lg font-semibold text-text-primary">{s.asset} SBP</h4>
            </div>
            <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full font-medium">Active</span>
          </div>
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <span className="text-text-tertiary">Amount</span>
            <span className="text-text-primary font-mono text-right">{s.amount}</span>
            <span className="text-text-tertiary">Active since</span>
            <span className="text-text-primary text-right">{s.since}</span>
            <span className="text-text-tertiary">Total invested</span>
            <span className="text-text-primary font-mono text-right">{s.invested}</span>
          </div>
          <div>
            <div className="flex items-center justify-between text-xs text-text-tertiary mb-1">
              <span>Goal progress</span>
              <span className="font-mono">{s.progress}%</span>
            </div>
            <div className="h-2 bg-surface-elevated rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${s.progress}%` }}
                transition={{ duration: 1, delay: 0.3 }}
                className="h-full rounded-full" style={{ backgroundColor: s.color }} />
            </div>
          </div>
          <div className="flex gap-3 pt-1">
            <button className="btn-secondary text-sm px-4 py-2 rounded-xl flex-1">Modify</button>
            <button className="btn-secondary text-sm px-4 py-2 rounded-xl flex-1">Pause</button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Transaction List
// ---------------------------------------------------------------------------

function TransactionList() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-surface-card rounded-2xl border border-border-subtle overflow-hidden">
      <div className="px-6 py-4 border-b border-border-subtle">
        <h3 className="text-lg font-semibold text-text-primary">Recent Transactions</h3>
      </div>
      <div className="divide-y divide-border-subtle">
        {transactions.map((t, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.06 }}
            className="px-6 py-4 flex items-center justify-between hover:bg-surface-elevated/50 transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <div className="min-w-0">
                <p className="text-text-primary font-medium truncate">{t.label}</p>
                <p className="text-text-tertiary text-xs">{t.detail}</p>
              </div>
              {t.badge && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 ${t.badgeColor}`}>{t.badge}</span>
              )}
            </div>
            <span className="text-text-tertiary text-xs shrink-0 ml-4">{t.time}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// AI Insights Panel
// ---------------------------------------------------------------------------

function AIInsightsPanel() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-surface-card rounded-2xl border border-border-subtle border-l-4 border-l-bitcoin/10 p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-bitcoin to-yellow-600 flex items-center justify-center text-white font-bold text-sm shrink-0">S</div>
        <div>
          <p className="text-text-primary font-semibold">Satoshi AI</p>
          <p className="text-text-tertiary text-xs">Portfolio Intelligence</p>
        </div>
      </div>
      <h4 className="text-text-primary font-semibold text-lg">Your Stack Grew 2.6% This Week</h4>
      <p className="text-text-secondary text-sm leading-relaxed">
        Your portfolio gained ₹12,450 in the last 24 hours, driven primarily by BTC and SOL outperformance.
        Your systematic buying plans continue to dollar-cost-average effectively.
      </p>
      <p className="text-text-secondary text-sm leading-relaxed">
        <span className="text-text-primary font-medium">Suggestion:</span>{" "}
        Consider increasing your ETH SBP allocation. Ethereum&apos;s upcoming network upgrades
        historically correlate with price appreciation.
      </p>
      <button onClick={handleRefresh} disabled={isRefreshing}
        className="btn-secondary text-sm px-4 py-2 rounded-xl inline-flex items-center gap-2 disabled:opacity-60">
        {isRefreshing ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Refreshing...
          </>
        ) : "Refresh Insights"}
      </button>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Vault Lock Section
// ---------------------------------------------------------------------------

function VaultLockSection() {
  const eightMonthsAgo = new Date();
  eightMonthsAgo.setMonth(eightMonthsAgo.getMonth() - 4);
  const fourMonthsFromNow = new Date();
  fourMonthsFromNow.setMonth(fourMonthsFromNow.getMonth() + 8);

  const [locks, setLocks] = useLocalStorage<VaultLock[]>("uno_vault_locks", [
    {
      id: "demo-1",
      asset: "BTC",
      amount: 0.01,
      amountFmt: "0.01 BTC",
      lockedAt: eightMonthsAgo.toISOString(),
      unlocksAt: fourMonthsFromNow.toISOString(),
      durationMonths: 12,
    },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [lockAmount, setLockAmount] = useState("0.005");
  const [lockDuration, setLockDuration] = useState(12);

  const handleLock = () => {
    const now = new Date();
    const unlockDate = new Date();
    unlockDate.setMonth(unlockDate.getMonth() + lockDuration);
    const newLock: VaultLock = {
      id: Date.now().toString(),
      asset: "BTC",
      amount: parseFloat(lockAmount),
      amountFmt: `${lockAmount} BTC`,
      lockedAt: now.toISOString(),
      unlocksAt: unlockDate.toISOString(),
      durationMonths: lockDuration,
    };
    setLocks((prev) => [...prev, newLock]);
    setShowForm(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-surface-card rounded-2xl border border-border-subtle p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🔒</span>
          <div>
            <h3 className="text-lg font-semibold text-text-primary">Vault Lock</h3>
            <p className="text-text-tertiary text-xs">Time-release your Bitcoin — diamond hands mode</p>
          </div>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="btn-primary text-sm px-4 py-2 rounded-xl">
          {showForm ? "Cancel" : "Lock BTC"}
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="bg-surface-elevated rounded-xl p-4 space-y-3 border border-border-subtle">
              <div>
                <label className="text-xs text-text-tertiary block mb-1">Amount (BTC)</label>
                <input type="number" step="0.001" value={lockAmount}
                  onChange={(e) => setLockAmount(e.target.value)}
                  className="w-full bg-surface border border-border-subtle rounded-lg px-3 py-2 text-sm text-text-primary font-mono outline-none focus:border-bitcoin/30" />
              </div>
              <div>
                <label className="text-xs text-text-tertiary block mb-1">Lock Duration</label>
                <div className="flex gap-2">
                  {[6, 12, 24].map((d) => (
                    <button key={d} onClick={() => setLockDuration(d)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                        lockDuration === d
                          ? "bg-bitcoin/15 border-bitcoin/30 text-bitcoin"
                          : "bg-surface border-border-subtle text-text-secondary hover:border-border-medium"
                      }`}>
                      {d}mo
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={handleLock}
                className="w-full btn-primary py-2.5 rounded-xl text-sm font-medium">
                💎 Lock {lockAmount} BTC for {lockDuration} months
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {locks.map((lock) => (
        <VaultLockCard key={lock.id} lock={lock} />
      ))}
    </motion.div>
  );
}

function VaultLockCard({ lock }: { lock: VaultLock }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    function update() {
      const now = Date.now();
      const end = new Date(lock.unlocksAt).getTime();
      const diff = end - now;
      if (diff <= 0) { setTimeLeft("Unlocked!"); return; }
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      setTimeLeft(`${days}d ${hours}h ${mins}m`);
    }
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [lock.unlocksAt]);

  const total = new Date(lock.unlocksAt).getTime() - new Date(lock.lockedAt).getTime();
  const elapsed = Date.now() - new Date(lock.lockedAt).getTime();
  const progress = Math.min(100, Math.max(0, (elapsed / total) * 100));

  return (
    <div className="bg-surface-elevated rounded-xl p-4 border border-border-subtle">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">💎</span>
          <span className="font-semibold text-text-primary font-mono">{lock.amountFmt}</span>
          <span className="text-xs bg-accent-purple/20 text-accent-purple px-2 py-0.5 rounded-full">Diamond Hands</span>
        </div>
        <span className="text-sm font-mono text-bitcoin">{timeLeft}</span>
      </div>
      <div className="h-2 bg-surface rounded-full overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }}
          transition={{ duration: 1 }}
          className="h-full rounded-full bg-gradient-to-r from-bitcoin to-bitcoin-light" />
      </div>
      <div className="flex justify-between text-xs text-text-tertiary mt-1">
        <span>Locked {lock.durationMonths}mo</span>
        <span>{Math.round(progress)}% elapsed</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Savings Goals Tab
// ---------------------------------------------------------------------------

function SavingsGoalsTab() {
  const [goals, setGoals] = useLocalStorage<SavingsGoal[]>("uno_savings_goals", [
    {
      id: "demo-goal-1",
      name: "Emergency Fund",
      targetAmount: 500000,
      currentAmount: 300000,
      deadline: new Date(Date.now() + 180 * 86400000).toISOString().split("T")[0],
      createdAt: new Date(Date.now() - 90 * 86400000).toISOString(),
    },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [goalName, setGoalName] = useState("");
  const [goalTarget, setGoalTarget] = useState("");
  const [goalDeadline, setGoalDeadline] = useState("");

  const handleAddGoal = () => {
    if (!goalName || !goalTarget) return;
    const newGoal: SavingsGoal = {
      id: Date.now().toString(),
      name: goalName,
      targetAmount: parseInt(goalTarget),
      currentAmount: 0,
      deadline: goalDeadline || new Date(Date.now() + 365 * 86400000).toISOString().split("T")[0],
      createdAt: new Date().toISOString(),
    };
    setGoals((prev) => [...prev, newGoal]);
    setGoalName("");
    setGoalTarget("");
    setGoalDeadline("");
    setShowForm(false);
  };

  return (
    <motion.div key="goals" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-text-primary">Savings Goals</h2>
        <button onClick={() => setShowForm(!showForm)}
          className="btn-primary text-sm px-4 py-2 rounded-xl">
          {showForm ? "Cancel" : "+ New Goal"}
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="bg-surface-card rounded-2xl border border-border-subtle p-6 space-y-4">
              <div>
                <label className="text-xs text-text-tertiary block mb-1">Goal Name</label>
                <input type="text" placeholder="e.g. New Car Fund" value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                  className="w-full bg-surface-elevated border border-border-subtle rounded-lg px-3 py-2 text-sm text-text-primary outline-none focus:border-bitcoin/30" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-text-tertiary block mb-1">Target Amount (₹)</label>
                  <input type="number" placeholder="500000" value={goalTarget}
                    onChange={(e) => setGoalTarget(e.target.value)}
                    className="w-full bg-surface-elevated border border-border-subtle rounded-lg px-3 py-2 text-sm text-text-primary font-mono outline-none focus:border-bitcoin/30" />
                </div>
                <div>
                  <label className="text-xs text-text-tertiary block mb-1">Deadline</label>
                  <input type="date" value={goalDeadline}
                    onChange={(e) => setGoalDeadline(e.target.value)}
                    className="w-full bg-surface-elevated border border-border-subtle rounded-lg px-3 py-2 text-sm text-text-primary outline-none focus:border-bitcoin/30" />
                </div>
              </div>
              <button onClick={handleAddGoal}
                className="btn-primary py-2.5 px-6 rounded-xl text-sm font-medium">
                🎯 Create Goal
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map((goal, i) => (
          <GoalCard key={goal.id} goal={goal} delay={i * 0.1} />
        ))}
      </div>

      {goals.length === 0 && (
        <div className="text-center py-12">
          <span className="text-4xl mb-4 block">🎯</span>
          <p className="text-text-secondary">No savings goals yet. Create one to start tracking!</p>
        </div>
      )}
    </motion.div>
  );
}

function GoalCard({ goal, delay }: { goal: SavingsGoal; delay: number }) {
  const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  const milestoneReached = pct >= 25 ? (pct >= 50 ? (pct >= 75 ? (pct >= 100 ? "100%" : "75%") : "50%") : "25%") : null;

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-surface-card rounded-2xl border border-border-subtle p-6">
      <div className="flex items-start gap-4">
        <div className="relative shrink-0">
          <svg viewBox="0 0 100 100" className="w-20 h-20 -rotate-90">
            <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
            <motion.circle cx="50" cy="50" r={radius} fill="none" stroke="#F7931A" strokeWidth="8"
              strokeLinecap="round" strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.5, ease: "easeOut", delay: delay + 0.2 }} />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold font-mono text-text-primary">{pct}%</span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-text-primary truncate">{goal.name}</h4>
          <p className="text-text-tertiary text-xs mt-0.5">
            {formatINR(goal.currentAmount)} of {formatINR(goal.targetAmount)}
          </p>
          {goal.deadline && (
            <p className="text-text-tertiary text-xs mt-1">
              Deadline: {new Date(goal.deadline).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
            </p>
          )}
          {milestoneReached && (
            <span className="inline-block mt-2 text-xs bg-bitcoin/15 text-bitcoin px-2 py-0.5 rounded-full font-medium">
              {milestoneReached} reached!
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Referral Earnings Panel
// ---------------------------------------------------------------------------

function ReferralPanel() {
  const [totalEarnings, setTotalEarnings] = useLocalStorage<number>("uno_referral_earnings", 1941);
  const [copied, setCopied] = useState(false);
  const [latestEvent, setLatestEvent] = useState<string | null>(null);
  const { unlock } = useAchievements();

  // Simulated live earnings
  useEffect(() => {
    const interval = setInterval(() => {
      const friend = DEMO_REFERRALS[Math.floor(Math.random() * DEMO_REFERRALS.length)];
      const trade = Math.round(500 + Math.random() * 15000);
      const earning = Math.round(trade * 0.003);
      setTotalEarnings((prev) => prev + earning);
      setLatestEvent(`${friend.name} traded ${formatINR(trade)} — you earned ${formatINR(earning)}`);
      setTimeout(() => setLatestEvent(null), 4000);
    }, 15000 + Math.random() * 15000);
    return () => clearInterval(interval);
  }, [setTotalEarnings]);

  const handleCopy = () => {
    navigator.clipboard.writeText("https://unocoin.com/ref/SUNNY2024").catch(() => {});
    setCopied(true);
    unlock("social_butterfly");
    setTimeout(() => setCopied(false), 2000);
  };

  const animatedTotal = useCountUp(totalEarnings, 1500);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-surface-card rounded-2xl border border-border-subtle p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🦋</span>
          <div>
            <h3 className="text-lg font-semibold text-text-primary">Referral Earnings</h3>
            <p className="text-text-tertiary text-xs">Earn when your friends trade</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold font-mono text-accent-green">₹{animatedTotal.toLocaleString("en-IN")}</p>
          <p className="text-xs text-text-tertiary">Total earned</p>
        </div>
      </div>

      {/* Referral link */}
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-surface-elevated rounded-lg px-3 py-2 text-xs font-mono text-text-secondary truncate border border-border-subtle">
          unocoin.com/ref/SUNNY2024
        </div>
        <button onClick={handleCopy}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            copied ? "bg-accent-green/20 text-accent-green" : "bg-bitcoin/15 text-bitcoin hover:bg-bitcoin/25"
          }`}>
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* Live event */}
      <AnimatePresence>
        {latestEvent && (
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}
            className="bg-accent-green/10 border border-accent-green/20 rounded-lg px-3 py-2 text-xs text-accent-green">
            {latestEvent}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Friends list */}
      <div className="space-y-2">
        <p className="text-xs text-text-tertiary font-medium uppercase tracking-wider">Your Referrals</p>
        {DEMO_REFERRALS.slice(0, 3).map((f) => (
          <div key={f.name} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-surface-elevated flex items-center justify-center text-xs font-medium text-text-secondary">
                {f.name[0]}
              </div>
              <span className="text-text-primary">{f.name}</span>
              <span className="text-text-tertiary text-xs">Joined {f.joined}</span>
            </div>
            <span className="font-mono text-accent-green text-xs">+{formatINR(f.yourEarnings)}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Quick Action Modal
// ---------------------------------------------------------------------------

function ActionModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-surface-card border border-border-subtle rounded-2xl p-8 max-w-md w-full text-center space-y-4 z-10">
            <div className="w-14 h-14 mx-auto rounded-full bg-bitcoin/20 flex items-center justify-center">
              <svg className="w-7 h-7 text-bitcoin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-text-primary">Connect Your Account</h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              Connect your Unocoin API key to enable trading, withdrawals, and real-time portfolio tracking.
            </p>
            <div className="flex gap-3 pt-2">
              <button onClick={onClose} className="btn-secondary flex-1 py-2.5 rounded-xl text-sm">Close</button>
              <button className="btn-primary flex-1 py-2.5 rounded-xl text-sm">Connect API Key</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ---------------------------------------------------------------------------
// Quick Actions Bar
// ---------------------------------------------------------------------------

function QuickActionsBar({ onAction }: { onAction: () => void }) {
  const actions = [
    { label: "Buy", bg: "bg-bitcoin hover:bg-bitcoin/90", icon: "+" },
    { label: "Sell", bg: "bg-accent-blue hover:bg-accent-blue/90", icon: "\u2193" },
    { label: "Send", bg: "bg-accent-green hover:bg-accent-green/90", icon: "\u2197" },
    { label: "Receive", bg: "bg-accent-purple hover:bg-accent-purple/90", icon: "\u2199" },
  ];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-3 bg-surface-card/90 backdrop-blur-xl border border-border-subtle rounded-2xl p-3">
      {actions.map((a) => (
        <button key={a.label} onClick={onAction}
          className={`${a.bg} text-white px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-1.5 transition-colors`}>
          <span className="text-base leading-none">{a.icon}</span>
          {a.label}
        </button>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export default function PortfolioPage() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [modalOpen, setModalOpen] = useState(false);
  const [lastPortfolioValue, setLastPortfolioValue] = useLocalStorage<number>("uno_last_portfolio_value", 0);
  const { unlock, isUnlocked, newlyUnlocked, dismissToast } = useAchievements();

  // Achievement checks on mount
  useEffect(() => {
    unlock("first_step"); // Visited portfolio
    unlock("digital_gold"); // Has BTC
    unlock("lightning_fast"); // Has Lightning tx
    unlock("diversified"); // 4 assets
    if (TOTAL_VALUE > 100000) unlock("whale_watch");
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 5) unlock("night_owl");
    if (hour >= 5 && hour < 7) unlock("early_bird");
    // BTC allocation > 80%?
    const btcAlloc = holdings.find((h) => h.asset === "BTC")?.allocation ?? 0;
    if (btcAlloc > 80) unlock("btc_maxi");
  }, [unlock]);

  // Save portfolio value for pulse animation
  useEffect(() => {
    const timer = setTimeout(() => setLastPortfolioValue(TOTAL_VALUE), 3000);
    return () => clearTimeout(timer);
  }, [setLastPortfolioValue]);

  return (
    <main className="relative bg-surface min-h-screen">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-32">
        {/* ---- Top Bar ---- */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">Portfolio Dashboard</h1>
              <span className="bg-bitcoin/20 text-bitcoin rounded-full px-2 py-0.5 text-xs font-medium">Demo</span>
            </div>
            <p className="text-text-tertiary text-sm">Connect your Unocoin account to see real data</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-text-tertiary text-xs">Total Value</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold font-mono text-text-primary">₹4,82,350</span>
                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full font-medium">+12.4%</span>
              </div>
            </div>
            <button onClick={() => setModalOpen(true)}
              className="btn-primary px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap">
              Connect API Key
            </button>
          </div>
        </motion.div>

        {/* ---- Tab Navigation ---- */}
        <div className="flex gap-1 border-b border-border-subtle mb-8 overflow-x-auto">
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className={`px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === t.key
                  ? "text-bitcoin border-b-2 border-bitcoin"
                  : "text-text-tertiary hover:text-text-secondary"
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ---- Tab Content ---- */}
        <AnimatePresence mode="wait">
          {/* === OVERVIEW === */}
          {activeTab === "overview" && (
            <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="space-y-8">
              <StreakCounter />
              <SummaryCards lastValue={lastPortfolioValue} />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <HoldingsTable />
                </div>
                <div className="bg-surface-card rounded-2xl border border-border-subtle p-6 flex items-center justify-center">
                  <DonutChart data={holdings} />
                </div>
              </div>
              <VaultLockSection />
              <AIInsightsPanel />
              <ReferralPanel />
            </motion.div>
          )}

          {/* === HOLDINGS === */}
          {activeTab === "holdings" && (
            <motion.div key="holdings" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              <HoldingsTable />
            </motion.div>
          )}

          {/* === SBPS === */}
          {activeTab === "sbps" && (
            <motion.div key="sbps" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-text-primary">Active Systematic Buying Plans</h2>
                <button className="btn-primary text-sm px-4 py-2 rounded-xl">+ New SBP</button>
              </div>
              <SBPCards />
            </motion.div>
          )}

          {/* === TRANSACTIONS === */}
          {activeTab === "transactions" && (
            <motion.div key="transactions" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              <TransactionList />
            </motion.div>
          )}

          {/* === GOALS === */}
          {activeTab === "goals" && <SavingsGoalsTab />}
        </AnimatePresence>
      </div>

      {/* ---- Quick Actions Bar ---- */}
      <QuickActionsBar onAction={() => setModalOpen(true)} />

      {/* ---- Modal ---- */}
      <ActionModal open={modalOpen} onClose={() => setModalOpen(false)} />

      {/* ---- Achievement Toast ---- */}
      {newlyUnlocked && (
        <AchievementToast achievementId={newlyUnlocked} onDismiss={dismissToast} />
      )}

      <Footer />
    </main>
  );
}
