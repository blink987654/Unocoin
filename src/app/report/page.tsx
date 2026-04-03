"use client";

import { useState, useRef, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { formatINR } from "@/lib/hooks";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getWeekRange(): string {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - 6);
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  return `${fmt(start)} – ${fmt(now)}`;
}

const sparklineData = [3.2, 4.1, 3.8, 5.0, 6.2, 5.8, 7.4];

function Sparkline() {
  const w = 200;
  const h = 60;
  const pad = 4;
  const max = Math.max(...sparklineData);
  const min = Math.min(...sparklineData);
  const range = max - min || 1;

  const points = sparklineData
    .map((v, i) => {
      const x = pad + (i / (sparklineData.length - 1)) * (w - pad * 2);
      const y = h - pad - ((v - min) / range) * (h - pad * 2);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-16" preserveAspectRatio="none">
      <defs>
        <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} />
          <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
        </linearGradient>
      </defs>
      <polygon
        points={`${pad},${h} ${points} ${w - pad},${h}`}
        fill="url(#sparkGrad)"
      />
      <polyline
        points={points}
        fill="none"
        stroke="#22c55e"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Section Wrapper with staggered reveal
// ---------------------------------------------------------------------------

function RevealCard({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={`bg-surface-card border border-border-subtle rounded-2xl p-8 ${className}`}
    >
      {children}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ReportPage() {
  const [toastVisible, setToastVisible] = useState(false);

  const handleShare = useCallback(() => {
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
  }, []);

  return (
    <main className="min-h-screen bg-surface text-primary">
      <Navigation />

      {/* Hero */}
      <section className="pt-32 pb-12 px-6 text-center">
        <motion.h1
          className="text-display-sm gradient-text-bitcoin mb-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Your Weekly Report
        </motion.h1>
        <motion.p
          className="text-text-secondary text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {getWeekRange()}
        </motion.p>
      </section>

      <div className="max-w-3xl mx-auto px-6 pb-24 space-y-6">
        {/* 1 — Performance Card */}
        <RevealCard delay={0}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-text-secondary text-sm mb-1">Total Portfolio Value</p>
              <p className="text-4xl font-bold tracking-tight">{formatINR(482350)}</p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-3 py-1 text-sm font-semibold text-green-400">
              ▲ 12.4%
            </span>
          </div>
          <Sparkline />
          <p className="text-text-secondary text-xs mt-2">7-day performance</p>
        </RevealCard>

        {/* 2 — SBP Contributions */}
        <RevealCard delay={0.05}>
          <h3 className="text-lg font-semibold mb-4">SBP Contributions</h3>
          <div className="flex items-center justify-between mb-2">
            <span className="text-text-secondary text-sm">This week</span>
            <span className="font-semibold text-bitcoin">{formatINR(5000)}</span>
          </div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-text-secondary text-sm">Total invested via SBP</span>
            <span className="font-semibold">{formatINR(87500)}</span>
          </div>
          <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-bitcoin to-yellow-500"
              initial={{ width: 0 }}
              whileInView={{ width: "58%" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
          <p className="text-text-secondary text-xs mt-2">
            {formatINR(87500)} of {formatINR(150000)} yearly target
          </p>
        </RevealCard>

        {/* 3 — Streak */}
        <RevealCard delay={0.1}>
          <div className="flex items-center gap-4">
            <span className="text-5xl">🔥</span>
            <div>
              <p className="text-3xl font-bold">47-day streak</p>
              <p className="text-text-secondary mt-1">
                You&apos;re in the <span className="text-bitcoin font-semibold">top 6%</span> of
                Unocoin investors
              </p>
            </div>
          </div>
        </RevealCard>

        {/* 4 — Peer Ranking */}
        <RevealCard delay={0.15}>
          <h3 className="text-lg font-semibold mb-4">Peer Ranking</h3>
          <p className="text-text-secondary text-sm mb-4">
            You outperformed <span className="text-primary font-semibold">73%</span> of Unocoin
            investors this week
          </p>
          <div className="relative w-full h-4 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-bitcoin/80 to-bitcoin"
              initial={{ width: 0 }}
              whileInView={{ width: "73%" }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            />
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white border-2 border-bitcoin shadow-lg shadow-bitcoin/30"
              initial={{ left: 0 }}
              whileInView={{ left: "73%" }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              style={{ marginLeft: "-10px" }}
            />
          </div>
          <div className="flex justify-between text-xs text-text-secondary mt-2">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </RevealCard>

        {/* 5 — What If */}
        <RevealCard delay={0.2} className="text-center">
          <p className="text-text-secondary text-sm mb-2">
            If you had started this SBP <span className="font-semibold text-primary">3 years ago</span>
          </p>
          <p className="text-5xl font-bold gradient-text-bitcoin mb-2">₹18.7L</p>
          <p className="text-text-secondary text-sm">
            That&apos;s what your portfolio would be worth today
          </p>
        </RevealCard>

        {/* 6 — AI Commentary */}
        <RevealCard delay={0.25}>
          <div className="flex items-center gap-2 mb-4">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-bitcoin/10 text-bitcoin text-sm font-bold">
              AI
            </span>
            <h3 className="text-lg font-semibold">Weekly Insight</h3>
          </div>
          <p className="text-text-secondary leading-relaxed">
            Strong week. Your Bitcoin allocation drove most of the gains as BTC crossed ₹70L. Your
            SBP is working exactly as designed — consistent buying through volatility. Consider
            increasing your monthly SBP by ₹1,000 to accelerate your ₹10L goal.
          </p>
        </RevealCard>

        {/* 7 — Share Button */}
        <motion.div
          className="text-center pt-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <button onClick={handleShare} className="btn-primary px-8 py-3 text-base font-semibold">
            Share Your Report
          </button>
        </motion.div>
      </div>

      {/* Share toast */}
      {toastVisible && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-surface-elevated border border-border-subtle rounded-xl px-6 py-3 text-sm font-medium shadow-2xl">
          Copied to clipboard!
        </div>
      )}

      <Footer />
    </main>
  );
}
