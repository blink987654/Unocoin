"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useAnimatedCounter, formatINR } from "@/lib/hooks";
import { shareOrDownload, drawRoundedRect } from "@/lib/share-utils";
import {
  TIMELINE_EVENTS,
  CURRENT_BTC_PRICE_INR,
  ERA_COLORS,
  ERA_LABELS,
  ERA_BG_GRADIENTS,
  simulateSBP,
  formatDateNice,
  getErasInOrder,
} from "@/lib/timeline-data";
import type { TimelineEvent, SBPSimulation } from "@/lib/types";

// ─── Constants ───────────────────────────────────────────────

const EASE_SMOOTH: [number, number, number, number] = [0.16, 1, 0.3, 1];
const WEEKLY_AMOUNTS = [500, 1000, 2000, 5000];

// ─── Animated Value Display ──────────────────────────────────

function AnimatedINR({ value, className }: { value: number; className?: string }) {
  const animated = useAnimatedCounter(value, 1200);
  return <span className={className}>{formatINR(animated)}</span>;
}

function AnimatedPercent({ value, className }: { value: number; className?: string }) {
  const animated = useAnimatedCounter(Math.round(value), 1200);
  return <span className={className}>{value >= 0 ? "+" : ""}{animated.toLocaleString()}%</span>;
}

function AnimatedBTC({ value }: { value: number }) {
  const display = value >= 1 ? value.toFixed(4) : value.toFixed(6);
  return <span className="font-mono text-text-primary">{display} BTC</span>;
}

// ─── Era Badge ───────────────────────────────────────────────

function EraBadge({ era }: { era: TimelineEvent["era"] }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
      style={{
        backgroundColor: `${ERA_COLORS[era]}20`,
        color: ERA_COLORS[era],
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: ERA_COLORS[era] }}
      />
      {ERA_LABELS[era]}
    </span>
  );
}

// ─── Timeline Dot ────────────────────────────────────────────

function TimelineDot({
  event,
  isSelected,
  onClick,
}: {
  event: TimelineEvent;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="relative flex flex-col items-center group focus:outline-none"
      title={`${formatDateNice(event.date)} - ${event.headline}`}
    >
      <motion.div
        animate={{
          scale: isSelected ? 1.6 : 1,
          boxShadow: isSelected
            ? `0 0 16px ${ERA_COLORS[event.era]}80, 0 0 32px ${ERA_COLORS[event.era]}40`
            : "0 0 0 transparent",
        }}
        transition={{ duration: 0.4, ease: EASE_SMOOTH }}
        className="w-3 h-3 rounded-full cursor-pointer transition-colors"
        style={{
          backgroundColor: isSelected ? ERA_COLORS[event.era] : `${ERA_COLORS[event.era]}80`,
          border: isSelected ? `2px solid ${ERA_COLORS[event.era]}` : "2px solid transparent",
        }}
      />
      {event.unocoinMilestone && (
        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-bitcoin" />
      )}
      {isSelected && (
        <motion.span
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -bottom-6 text-[10px] text-text-secondary whitespace-nowrap font-mono"
        >
          {event.date.slice(0, 4)}
        </motion.span>
      )}
    </button>
  );
}

// ─── Event Card ──────────────────────────────────────────────

function EventCard({ event }: { event: TimelineEvent }) {
  return (
    <motion.div
      key={event.date}
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -16, scale: 0.97 }}
      transition={{ duration: 0.5, ease: EASE_SMOOTH }}
      className="bg-surface-card border border-border-subtle rounded-2xl p-6 md:p-8 max-w-2xl mx-auto"
    >
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <EraBadge era={event.era} />
        {event.unocoinMilestone && (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-bitcoin/15 text-bitcoin">
            Unocoin
          </span>
        )}
      </div>

      <p className="text-text-secondary text-sm mb-2 font-mono">
        {formatDateNice(event.date)}
      </p>

      <div className="mb-4">
        <span className="text-3xl md:text-4xl font-bold font-mono text-text-primary">
          {event.btcPriceINR === 0
            ? "< Re.1"
            : `₹${event.btcPriceINR.toLocaleString("en-IN")}`}
        </span>
        <span className="text-text-secondary text-sm ml-2">/ BTC</span>
      </div>

      <p className="text-lg md:text-xl text-text-primary leading-relaxed">
        {event.headline}
      </p>

      {event.unocoinMilestone && (
        <div className="mt-4 flex items-center gap-2 text-bitcoin text-sm">
          <span className="w-1 h-1 rounded-full bg-bitcoin" />
          {event.unocoinMilestone}
        </div>
      )}
    </motion.div>
  );
}

// ─── SBP Results Card ────────────────────────────────────────

function SBPResults({ simulation }: { simulation: SBPSimulation }) {
  const isProfitable = simulation.returnPct > 0;

  return (
    <motion.div
      key={`${simulation.startDate}-${simulation.weeklyAmount}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE_SMOOTH }}
      className="grid grid-cols-2 md:grid-cols-4 gap-4"
    >
      <div className="bg-surface-card border border-border-subtle rounded-xl p-4">
        <p className="text-text-tertiary text-xs mb-1 uppercase tracking-wider">Total Invested</p>
        <AnimatedINR value={simulation.totalInvested} className="text-lg font-bold font-mono text-text-primary" />
      </div>

      <div className="bg-surface-card border border-border-subtle rounded-xl p-4">
        <p className="text-text-tertiary text-xs mb-1 uppercase tracking-wider">BTC Accumulated</p>
        <AnimatedBTC value={simulation.btcAccumulated} />
      </div>

      <div className="bg-surface-card border border-border-subtle rounded-xl p-4">
        <p className="text-text-tertiary text-xs mb-1 uppercase tracking-wider">Current Value</p>
        <AnimatedINR
          value={simulation.currentValue}
          className={`text-lg font-bold font-mono ${isProfitable ? "text-accent-green" : "text-red-400"}`}
        />
      </div>

      <div className="bg-surface-card border border-border-subtle rounded-xl p-4">
        <p className="text-text-tertiary text-xs mb-1 uppercase tracking-wider">Return</p>
        <AnimatedPercent
          value={simulation.returnPct}
          className={`text-lg font-bold font-mono ${isProfitable ? "text-accent-green" : "text-red-400"}`}
        />
      </div>
    </motion.div>
  );
}

// ─── Share Card Generator ────────────────────────────────────

function generateShareCard(
  event: TimelineEvent,
  simulation: SBPSimulation,
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 630;
  const ctx = canvas.getContext("2d")!;

  // Background
  ctx.fillStyle = "#0A0A0A";
  ctx.fillRect(0, 0, 1200, 630);

  // Era tinted gradient overlay
  const eraColor = ERA_COLORS[event.era];
  const grad = ctx.createRadialGradient(600, 0, 0, 600, 300, 600);
  grad.addColorStop(0, `${eraColor}30`);
  grad.addColorStop(1, "transparent");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1200, 630);

  // Branding
  ctx.fillStyle = "#F7931A";
  ctx.font = "bold 28px Inter, system-ui, sans-serif";
  ctx.fillText("IndiaBitcoin.com", 60, 60);

  ctx.fillStyle = "#A0A0A0";
  ctx.font = "16px Inter, system-ui, sans-serif";
  ctx.fillText("Bitcoin Time Machine", 60, 90);

  // Date & Era
  ctx.fillStyle = eraColor;
  ctx.font = "bold 16px Inter, system-ui, sans-serif";
  ctx.fillText(ERA_LABELS[event.era].toUpperCase(), 60, 150);

  ctx.fillStyle = "#FAFAFA";
  ctx.font = "20px monospace";
  ctx.fillText(formatDateNice(event.date), 60, 180);

  // Headline
  ctx.fillStyle = "#FAFAFA";
  ctx.font = "bold 32px Inter, system-ui, sans-serif";
  const words = event.headline.split(" ");
  let line = "";
  let y = 230;
  for (const word of words) {
    const test = line + word + " ";
    if (ctx.measureText(test).width > 1080) {
      ctx.fillText(line.trim(), 60, y);
      line = word + " ";
      y += 42;
    } else {
      line = test;
    }
  }
  ctx.fillText(line.trim(), 60, y);

  // BTC Price
  ctx.fillStyle = "#F7931A";
  ctx.font = "bold 48px monospace";
  const priceStr = event.btcPriceINR === 0
    ? "< Re.1"
    : `₹${event.btcPriceINR.toLocaleString("en-IN")}`;
  ctx.fillText(priceStr + " / BTC", 60, y + 80);

  // SBP Result card
  const cardY = 420;
  drawRoundedRect(ctx, 50, cardY, 1100, 150, 16);
  ctx.fillStyle = "#161616";
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.06)";
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = "#A0A0A0";
  ctx.font = "14px Inter, system-ui, sans-serif";
  ctx.fillText(`Weekly SBP of ₹${simulation.weeklyAmount.toLocaleString("en-IN")}`, 80, cardY + 35);

  ctx.fillStyle = "#FAFAFA";
  ctx.font = "bold 16px monospace";
  ctx.fillText(`Invested: ₹${simulation.totalInvested.toLocaleString("en-IN")}`, 80, cardY + 70);

  const isProfitable = simulation.returnPct > 0;
  ctx.fillStyle = isProfitable ? "#22C55E" : "#EF4444";
  ctx.font = "bold 28px monospace";
  ctx.fillText(
    `Value today: ₹${simulation.currentValue.toLocaleString("en-IN")}  (${isProfitable ? "+" : ""}${simulation.returnPct}%)`,
    80,
    cardY + 110,
  );

  // Footer CTA
  ctx.fillStyle = "#666666";
  ctx.font = "14px Inter, system-ui, sans-serif";
  ctx.fillText("Start your SBP at IndiaBitcoin.com/autopilot", 60, 610);

  return canvas;
}

// ─── Main Page Component ─────────────────────────────────────

export default function TimeMachinePage() {
  const [selectedIndex, setSelectedIndex] = useState(TIMELINE_EVENTS.length - 1);
  const [weeklyAmount, setWeeklyAmount] = useState(1000);
  const [isSharing, setIsSharing] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);

  const selectedEvent = TIMELINE_EVENTS[selectedIndex];

  const simulation = useMemo(
    () => simulateSBP(selectedEvent.date, weeklyAmount),
    [selectedEvent.date, weeklyAmount],
  );

  const eras = useMemo(() => getErasInOrder(), []);

  // Group event indices by era for the timeline
  const eraGroups = useMemo(() => {
    const groups: { era: TimelineEvent["era"]; indices: number[] }[] = [];
    let currentEra: TimelineEvent["era"] | null = null;
    for (let i = 0; i < TIMELINE_EVENTS.length; i++) {
      const e = TIMELINE_EVENTS[i];
      if (e.era !== currentEra) {
        currentEra = e.era;
        groups.push({ era: e.era, indices: [i] });
      } else {
        groups[groups.length - 1].indices.push(i);
      }
    }
    return groups;
  }, []);

  const handleShare = useCallback(async () => {
    setIsSharing(true);
    try {
      const canvas = generateShareCard(selectedEvent, simulation);
      await shareOrDownload(canvas, `Bitcoin-Time-Machine-${selectedEvent.date}`);
    } finally {
      setIsSharing(false);
    }
  }, [selectedEvent, simulation]);

  return (
    <div className="min-h-screen bg-surface grain relative">
      {/* Animated background gradient */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-0"
        animate={{ background: ERA_BG_GRADIENTS[selectedEvent.era] }}
        transition={{ duration: 1.2, ease: EASE_SMOOTH }}
      />

      <Navigation />

      <main className="relative z-10 pt-24 pb-16">
        {/* Header */}
        <section className="max-w-5xl mx-auto px-6 text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE_SMOOTH }}
            className="text-4xl md:text-6xl font-bold text-text-primary mb-4"
          >
            Bitcoin{" "}
            <span className="text-bitcoin glow-text">Time Machine</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE_SMOOTH, delay: 0.1 }}
            className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto"
          >
            Drag through history. See what you missed. Start your SBP today.
          </motion.p>
        </section>

        {/* Desktop Timeline */}
        <section className="hidden md:block max-w-6xl mx-auto px-6 mb-12">
          <div
            ref={timelineRef}
            className="relative overflow-x-auto pb-10 scrollbar-thin"
          >
            {/* Era labels */}
            <div className="flex items-end mb-3 min-w-max px-4">
              {eraGroups.map((group) => (
                <div
                  key={group.era}
                  className="flex-shrink-0"
                  style={{ width: `${group.indices.length * 56}px` }}
                >
                  <span
                    className="text-[11px] font-semibold uppercase tracking-wider"
                    style={{ color: ERA_COLORS[group.era] }}
                  >
                    {ERA_LABELS[group.era]}
                  </span>
                </div>
              ))}
            </div>

            {/* Line + dots */}
            <div className="relative min-w-max px-4">
              {/* Base line */}
              <div className="absolute top-1.5 left-4 right-4 h-px bg-border-medium" />

              {/* Dots */}
              <div className="flex items-center gap-10">
                {TIMELINE_EVENTS.map((event, i) => (
                  <TimelineDot
                    key={event.date}
                    event={event}
                    isSelected={i === selectedIndex}
                    onClick={() => setSelectedIndex(i)}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Mobile Event Selector */}
        <section className="md:hidden max-w-lg mx-auto px-6 mb-8">
          <label className="text-text-tertiary text-xs uppercase tracking-wider mb-2 block">
            Select Event
          </label>
          <select
            value={selectedIndex}
            onChange={(e) => setSelectedIndex(Number(e.target.value))}
            className="w-full bg-surface-card border border-border-subtle rounded-xl px-4 py-3 text-text-primary text-sm focus:outline-none focus:ring-1 focus:ring-bitcoin appearance-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23A0A0A0' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10l-5 5z'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 16px center",
            }}
          >
            {TIMELINE_EVENTS.map((event, i) => (
              <option key={event.date} value={i}>
                {event.date.slice(0, 4)} - {event.headline.slice(0, 50)}
                {event.headline.length > 50 ? "..." : ""}
              </option>
            ))}
          </select>

          {/* Mobile era pills - horizontal scroll */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-thin">
            {eras.map((era) => {
              const firstIndex = TIMELINE_EVENTS.findIndex((e) => e.era === era);
              if (firstIndex === -1) return null;
              const isActive = selectedEvent.era === era;
              return (
                <button
                  key={era}
                  onClick={() => setSelectedIndex(firstIndex)}
                  className={`flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
                    isActive
                      ? "text-white"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                  style={{
                    backgroundColor: isActive ? `${ERA_COLORS[era]}30` : "transparent",
                    color: isActive ? ERA_COLORS[era] : undefined,
                    border: `1px solid ${isActive ? ERA_COLORS[era] : "rgba(255,255,255,0.06)"}`,
                  }}
                >
                  {ERA_LABELS[era]}
                </button>
              );
            })}
          </div>
        </section>

        {/* Event Card */}
        <section className="max-w-5xl mx-auto px-6 mb-12">
          <AnimatePresence mode="wait">
            <EventCard event={selectedEvent} />
          </AnimatePresence>
        </section>

        {/* SBP Calculator */}
        <section className="max-w-5xl mx-auto px-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_SMOOTH, delay: 0.2 }}
          >
            <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-2">
              What if you started a weekly SBP on this date?
            </h2>
            <p className="text-text-secondary text-sm mb-6">
              See how much your systematic buying plan would be worth today.
            </p>

            {/* Amount Toggle */}
            <div className="flex flex-wrap gap-2 mb-6">
              {WEEKLY_AMOUNTS.map((amount) => (
                <button
                  key={amount}
                  onClick={() => setWeeklyAmount(amount)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    weeklyAmount === amount
                      ? "bg-bitcoin text-white shadow-lg shadow-bitcoin/20"
                      : "bg-surface-card border border-border-subtle text-text-secondary hover:text-text-primary hover:border-border-medium"
                  }`}
                >
                  ₹{amount.toLocaleString("en-IN")}/week
                </button>
              ))}
            </div>

            {/* Results */}
            <SBPResults simulation={simulation} />
          </motion.div>
        </section>

        {/* Share Button */}
        <section className="max-w-5xl mx-auto px-6 mb-16 flex justify-center">
          <motion.button
            onClick={handleShare}
            disabled={isSharing}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-3 bg-surface-card border border-border-subtle hover:border-border-medium rounded-xl px-6 py-3 text-text-primary transition-colors disabled:opacity-50"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
            {isSharing ? "Generating..." : "Share this result"}
          </motion.button>
        </section>

        {/* CTA */}
        <section className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE_SMOOTH }}
            className="bg-surface-card border border-border-subtle rounded-2xl p-8 md:p-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-3">
              Don&apos;t let future-you ask{" "}
              <span className="text-bitcoin">&ldquo;What if?&rdquo;</span>
            </h2>
            <p className="text-text-secondary mb-8 max-w-md mx-auto">
              The best time to start was years ago. The second best time is now.
              Set up a weekly SBP in under 2 minutes.
            </p>
            <a
              href="/autopilot"
              className="inline-flex items-center gap-2 bg-bitcoin hover:bg-bitcoin-dark text-white font-semibold px-8 py-3.5 rounded-xl transition-colors shadow-lg shadow-bitcoin/20"
            >
              Start your SBP today
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
