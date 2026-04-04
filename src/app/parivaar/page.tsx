"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useFamilyVault, formatINR, useLocalStorage } from "@/lib/hooks";
import type { FamilyMember, FamilyGoal, FamilyGift, FamilyActivity, ParivarReportCard } from "@/lib/types";

// ─── Constants ───────────────────────────────────────────────

const EASE_SMOOTH: [number, number, number, number] = [0.16, 1, 0.3, 1];

const OCCASIONS = [
  { value: "diwali", label: "Diwali" },
  { value: "rakhi", label: "Rakhi" },
  { value: "birthday", label: "Birthday" },
  { value: "eid", label: "Eid" },
  { value: "custom", label: "Custom" },
] as const;

// ─── Golden Mandala SVG ─────────────────────────────────────

function GoldenMandala() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-[200px] h-[200px] opacity-20 animate-mandala-rotate"
      >
        {/* Concentric circles */}
        <circle cx="100" cy="100" r="90" stroke="#F7931A" strokeWidth="0.5" opacity="0.4" />
        <circle cx="100" cy="100" r="70" stroke="#F7931A" strokeWidth="0.5" opacity="0.5" />
        <circle cx="100" cy="100" r="50" stroke="#F7931A" strokeWidth="0.5" opacity="0.6" />
        <circle cx="100" cy="100" r="30" stroke="#F7931A" strokeWidth="0.8" opacity="0.7" />
        <circle cx="100" cy="100" r="10" fill="#F7931A" opacity="0.15" />
        {/* Radiating lines */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          const x2 = 100 + 90 * Math.cos(angle);
          const y2 = 100 + 90 * Math.sin(angle);
          return (
            <line
              key={i}
              x1="100"
              y1="100"
              x2={x2}
              y2={y2}
              stroke="#F7931A"
              strokeWidth="0.4"
              opacity="0.3"
            />
          );
        })}
        {/* Petal dots on inner ring */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i * 45 * Math.PI) / 180;
          const cx = 100 + 50 * Math.cos(angle);
          const cy = 100 + 50 * Math.sin(angle);
          return <circle key={`d-${i}`} cx={cx} cy={cy} r="3" fill="#F7931A" opacity="0.2" />;
        })}
        {/* Outer petal dots */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = ((i * 30 + 15) * Math.PI) / 180;
          const cx = 100 + 70 * Math.cos(angle);
          const cy = 100 + 70 * Math.sin(angle);
          return <circle key={`o-${i}`} cx={cx} cy={cy} r="2" fill="#F7931A" opacity="0.25" />;
        })}
      </svg>
    </div>
  );
}

// ─── Confetti Overlay ───────────────────────────────────────

function ConfettiOverlay({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {Array.from({ length: 24 }).map((_, i) => (
        <div
          key={i}
          className="absolute animate-confetti"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 0.8}s`,
            color: ["#F7931A", "#FFD700", "#FF6B35", "#22C55E", "#F43F5E"][i % 5],
            fontSize: `${12 + Math.random() * 10}px`,
          }}
        >
          {["🎉", "✨", "🪔", "🎊", "💛"][i % 5]}
        </div>
      ))}
    </div>
  );
}

// ─── Time Ago Formatter ─────────────────────────────────────

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

// ─── Main Page Component ────────────────────────────────────

export default function ParivaarPage() {
  const { members, goals, gifts, addGift, activities, totalValue } = useFamilyVault();
  const [report, setReport] = useLocalStorage<ParivarReportCard | null>("uno_parivaar_report", null);
  const [reportLoading, setReportLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Gift form state
  const [giftOccasion, setGiftOccasion] = useState<FamilyGift["occasion"]>("diwali");
  const [giftFrom, setGiftFrom] = useState(members[0]?.id ?? "");
  const [giftTo, setGiftTo] = useState(members[1]?.id ?? "");
  const [giftAmount, setGiftAmount] = useState("");
  const [giftMessage, setGiftMessage] = useState("");

  // Find top contributor
  const topContributor = members.reduce((top, m) => (m.contribution > top.contribution ? m : top), members[0]);

  // Send gift handler
  const handleSendGift = useCallback(() => {
    const amount = parseInt(giftAmount, 10);
    if (!amount || amount <= 0 || giftFrom === giftTo) return;
    const fromMember = members.find((m) => m.id === giftFrom);
    const toMember = members.find((m) => m.id === giftTo);
    if (!fromMember || !toMember) return;

    addGift({
      id: Date.now().toString(),
      from: fromMember.name,
      to: toMember.name,
      amount,
      occasion: giftOccasion,
      message: giftMessage || `Happy ${giftOccasion}!`,
      sentAt: new Date().toISOString(),
    });

    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
    setGiftAmount("");
    setGiftMessage("");
  }, [giftAmount, giftFrom, giftTo, giftOccasion, giftMessage, members, addGift]);

  // Generate report card
  const handleGenerateReport = useCallback(async () => {
    setReportLoading(true);
    try {
      const res = await fetch("/api/parivaar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ members, goals, totalValue }),
      });
      if (res.ok) {
        const data: ParivarReportCard = await res.json();
        setReport(data);
      }
    } catch {
      // Silently fail
    } finally {
      setReportLoading(false);
    }
  }, [members, goals, totalValue, setReport]);

  return (
    <>
      <Navigation />
      <ConfettiOverlay show={showConfetti} />

      <main className="min-h-screen bg-surface text-text-primary">
        {/* ── Hero Section ───────────────────────────────────── */}
        <section className="relative overflow-hidden pt-32 pb-20">
          <div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(ellipse at center, rgba(247,147,26,0.06) 0%, transparent 70%)",
            }}
          />
          <GoldenMandala />

          <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE_SMOOTH }}
            >
              <span className="text-3xl mb-4 inline-block animate-diya-flicker">🪔</span>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
                <span className="text-bitcoin">Parivaar</span> Portfolio
              </h1>
              <p className="text-text-secondary text-lg md:text-xl max-w-xl mx-auto">
                Saath mein sanchay, saath mein safar
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── Family Total Value Card ────────────────────────── */}
        <section className="max-w-5xl mx-auto px-4 -mt-8 mb-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: EASE_SMOOTH }}
            className="glass-card p-8 md:p-10 text-center rounded-2xl border border-border-subtle"
          >
            <p className="text-text-tertiary text-sm uppercase tracking-widest mb-2">
              Family Vault
            </p>
            <p className="text-4xl md:text-5xl font-bold text-bitcoin mb-2">
              {formatINR(totalValue)}
            </p>
            <p className="text-text-secondary text-sm">
              {members.length} members contributing together
            </p>
          </motion.div>
        </section>

        {/* ── Family Members Grid ────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-4 mb-16">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASE_SMOOTH }}
            className="text-2xl font-bold mb-6"
          >
            Family Members
          </motion.h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {members.map((member, i) => {
              const isTop = member.id === topContributor.id;
              return (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: EASE_SMOOTH }}
                  whileHover={{ y: -4 }}
                  className={`bg-surface-card rounded-xl p-5 border transition-colors ${
                    isTop
                      ? "border-bitcoin/40 shadow-[0_0_20px_rgba(247,147,26,0.08)]"
                      : "border-border-subtle hover:border-border-medium"
                  }`}
                >
                  <div className="text-4xl mb-3">{member.avatar}</div>
                  <h3 className="font-semibold text-text-primary">{member.name}</h3>
                  <p className="text-text-tertiary text-xs mb-3">{member.role}</p>
                  <p className="text-bitcoin font-bold text-lg mb-1">
                    {formatINR(member.contribution)}
                  </p>
                  <p className="text-text-secondary text-xs">
                    🔥 {member.streak}-day streak
                  </p>
                  {isTop && (
                    <span className="inline-block mt-2 text-[10px] bg-bitcoin/10 text-bitcoin px-2 py-0.5 rounded-full">
                      Top Contributor
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ── Family Goals Section ───────────────────────────── */}
        <section className="max-w-5xl mx-auto px-4 mb-16">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASE_SMOOTH }}
            className="text-2xl font-bold mb-6"
          >
            Family Goals
          </motion.h2>

          <div className="space-y-4">
            {goals.map((goal, i) => {
              const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
              return (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1, ease: EASE_SMOOTH }}
                  className="glass-card rounded-xl p-6 border border-border-subtle"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{goal.icon}</span>
                      <div>
                        <h3 className="font-semibold">{goal.name}</h3>
                        <p className="text-text-secondary text-sm">
                          {formatINR(goal.currentAmount)} of {formatINR(goal.targetAmount)}
                        </p>
                      </div>
                    </div>
                    <span className="text-bitcoin font-bold text-lg">{pct}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-surface rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.3, ease: EASE_SMOOTH }}
                      className="h-full rounded-full"
                      style={{
                        background: "linear-gradient(90deg, #F7931A, #FFD700)",
                      }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ── Gift Card Section ──────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-4 mb-16">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASE_SMOOTH }}
            className="text-2xl font-bold mb-6"
          >
            Send Satoshis 🪔
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE_SMOOTH }}
            className="glass-card rounded-xl p-6 md:p-8 border border-border-subtle"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Occasion */}
              <div>
                <label className="block text-text-secondary text-sm mb-1.5">Occasion</label>
                <select
                  value={giftOccasion}
                  onChange={(e) => setGiftOccasion(e.target.value as FamilyGift["occasion"])}
                  className="w-full bg-surface-elevated border border-border-medium rounded-lg px-3 py-2.5 text-text-primary focus:outline-none focus:border-bitcoin transition-colors"
                >
                  {OCCASIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-text-secondary text-sm mb-1.5">Amount (INR)</label>
                <input
                  type="number"
                  value={giftAmount}
                  onChange={(e) => setGiftAmount(e.target.value)}
                  placeholder="500"
                  className="w-full bg-surface-elevated border border-border-medium rounded-lg px-3 py-2.5 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-bitcoin transition-colors"
                />
              </div>

              {/* From */}
              <div>
                <label className="block text-text-secondary text-sm mb-1.5">From</label>
                <select
                  value={giftFrom}
                  onChange={(e) => setGiftFrom(e.target.value)}
                  className="w-full bg-surface-elevated border border-border-medium rounded-lg px-3 py-2.5 text-text-primary focus:outline-none focus:border-bitcoin transition-colors"
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.avatar} {m.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* To */}
              <div>
                <label className="block text-text-secondary text-sm mb-1.5">To</label>
                <select
                  value={giftTo}
                  onChange={(e) => setGiftTo(e.target.value)}
                  className="w-full bg-surface-elevated border border-border-medium rounded-lg px-3 py-2.5 text-text-primary focus:outline-none focus:border-bitcoin transition-colors"
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.avatar} {m.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Message */}
            <div className="mb-5">
              <label className="block text-text-secondary text-sm mb-1.5">Message</label>
              <input
                type="text"
                value={giftMessage}
                onChange={(e) => setGiftMessage(e.target.value)}
                placeholder="Happy Diwali! Apne liye Bitcoin rakho..."
                className="w-full bg-surface-elevated border border-border-medium rounded-lg px-3 py-2.5 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-bitcoin transition-colors"
              />
            </div>

            {/* Send Button */}
            <button
              onClick={handleSendGift}
              disabled={!giftAmount || parseInt(giftAmount, 10) <= 0 || giftFrom === giftTo}
              className="w-full bg-bitcoin hover:bg-bitcoin/90 disabled:opacity-40 disabled:cursor-not-allowed text-surface font-semibold py-3 rounded-lg transition-colors"
            >
              Send Gift
            </button>

            {/* Recent Gifts */}
            {gifts.length > 0 && (
              <div className="mt-6 pt-6 border-t border-border-subtle">
                <h3 className="text-sm font-semibold text-text-secondary mb-3">Recent Gifts</h3>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {gifts.slice(0, 10).map((gift) => (
                    <div
                      key={gift.id}
                      className="flex items-center justify-between text-sm bg-surface-elevated rounded-lg px-4 py-3"
                    >
                      <div>
                        <span className="text-text-primary font-medium">{gift.from}</span>
                        <span className="text-text-tertiary mx-1.5">gifted</span>
                        <span className="text-bitcoin font-medium">{formatINR(gift.amount)}</span>
                        <span className="text-text-tertiary mx-1.5">to</span>
                        <span className="text-text-primary font-medium">{gift.to}</span>
                      </div>
                      <span className="text-text-tertiary text-xs capitalize">{gift.occasion}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </section>

        {/* ── Activity Feed ──────────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-4 mb-16">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASE_SMOOTH }}
            className="text-2xl font-bold mb-6"
          >
            Activity Feed
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE_SMOOTH }}
            className="glass-card rounded-xl border border-border-subtle overflow-hidden"
          >
            {activities.length === 0 ? (
              <div className="p-8 text-center text-text-tertiary">
                No activity yet. Send a gift to get started!
              </div>
            ) : (
              <div className="divide-y divide-border-subtle max-h-80 overflow-y-auto">
                {activities.slice(0, 20).map((activity) => {
                  const member = members.find((m) => m.id === activity.memberId);
                  return (
                    <div key={activity.id} className="flex items-center gap-3 px-5 py-3.5">
                      <span className="text-xl shrink-0">
                        {member?.avatar ?? "👤"}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-text-primary truncate">
                          <span className="font-medium">{activity.memberName}</span>{" "}
                          <span className="text-text-secondary">{activity.action}</span>
                        </p>
                      </div>
                      <span className="text-text-tertiary text-xs shrink-0">
                        {timeAgo(activity.timestamp)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </section>

        {/* ── AI Report Card ─────────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-4 mb-16">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASE_SMOOTH }}
            className="text-2xl font-bold mb-6"
          >
            Monthly Report Card
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE_SMOOTH }}
            className="glass-card rounded-xl p-6 md:p-8 border border-border-subtle"
          >
            {!report ? (
              <div className="text-center">
                <p className="text-text-secondary mb-4">
                  Generate a monthly report card for your family vault with AI insights.
                </p>
                <button
                  onClick={handleGenerateReport}
                  disabled={reportLoading}
                  className="bg-bitcoin hover:bg-bitcoin/90 disabled:opacity-60 text-surface font-semibold px-6 py-3 rounded-lg transition-colors"
                >
                  {reportLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Generating...
                    </span>
                  ) : (
                    "Generate Report Card"
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-bitcoin">{report.month}</h3>
                  <button
                    onClick={handleGenerateReport}
                    disabled={reportLoading}
                    className="text-text-tertiary hover:text-text-secondary text-xs transition-colors"
                  >
                    {reportLoading ? "Refreshing..." : "Refresh"}
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-surface-elevated rounded-lg p-4">
                    <p className="text-text-tertiary text-xs mb-1">Total Contributed</p>
                    <p className="text-text-primary font-bold">
                      {formatINR(report.totalContributed)}
                    </p>
                  </div>
                  <div className="bg-surface-elevated rounded-lg p-4">
                    <p className="text-text-tertiary text-xs mb-1">Top Contributor</p>
                    <p className="text-text-primary font-bold">{report.topContributor}</p>
                  </div>
                  <div className="bg-surface-elevated rounded-lg p-4">
                    <p className="text-text-tertiary text-xs mb-1">Streak Champion</p>
                    <p className="text-text-primary font-bold">{report.streakChampion}</p>
                  </div>
                  <div className="bg-surface-elevated rounded-lg p-4">
                    <p className="text-text-tertiary text-xs mb-1">Goal Progress</p>
                    <p className="text-bitcoin font-bold">{report.goalProgress}%</p>
                  </div>
                </div>

                <div className="bg-surface-elevated rounded-lg p-4 mt-2">
                  <p className="text-text-tertiary text-xs mb-1.5">AI Insight</p>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {report.aiInsight}
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </section>

        {/* ── CTA Section ────────────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-4 mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE_SMOOTH }}
            className="text-center py-12 px-6 rounded-2xl border border-border-subtle"
            style={{
              background: "radial-gradient(ellipse at center, rgba(247,147,26,0.04) 0%, transparent 70%)",
            }}
          >
            <span className="text-3xl mb-3 inline-block">🪔</span>
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Add your family to the vault
            </h2>
            <p className="text-text-secondary mb-6 max-w-md mx-auto">
              Bitcoin is better together. Start building generational wealth with your loved ones.
            </p>
            <Link
              href="/autopilot"
              className="inline-block bg-bitcoin hover:bg-bitcoin/90 text-surface font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Get Started
            </Link>
          </motion.div>
        </section>
      </main>

      <Footer />
    </>
  );
}
