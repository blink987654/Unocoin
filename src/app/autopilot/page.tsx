"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// ─── Types ──────────────────────────────────────────────────
interface UserProfile {
  age: string;
  monthly_income: string;
  investment_budget: string;
  goal: string;
  time_horizon: string;
  risk_tolerance: string;
}

interface Allocation {
  product: string;
  amount_inr: number;
  frequency: string;
  percentage: number;
  rationale: string;
}

interface Projections {
  conservative: Record<string, number>;
  moderate: Record<string, number>;
  aggressive: Record<string, number>;
}

interface Strategy {
  strategy_name: string;
  risk_profile: string;
  summary: string;
  allocations: Allocation[];
  monthly_total_inr: number;
  projections: Projections;
  insight: string;
}

// ─── Onboarding Steps ───────────────────────────────────────
const STEPS = [
  {
    key: "age",
    question: "How old are you?",
    subtext: "This helps us optimize your time horizon.",
    type: "select" as const,
    options: ["18-25", "25-35", "35-45", "45-55", "55+"],
  },
  {
    key: "monthly_income",
    question: "What's your monthly income?",
    subtext: "Approximate is fine. We'll tailor the plan to your capacity.",
    type: "select" as const,
    options: ["Under ₹25K", "₹25K-50K", "₹50K-1L", "₹1L-3L", "₹3L-10L", "₹10L+"],
  },
  {
    key: "investment_budget",
    question: "How much can you invest per month?",
    subtext: "Start small, grow later. There's no wrong answer.",
    type: "select" as const,
    options: ["₹500", "₹1,000", "₹2,500", "₹5,000", "₹10,000", "₹25,000", "₹50,000+"],
  },
  {
    key: "goal",
    question: "What are you building towards?",
    subtext: "Your goal shapes the strategy.",
    type: "select" as const,
    options: [
      "Long-term wealth building",
      "Retirement savings",
      "Saving for a home",
      "Financial freedom",
      "Beat inflation",
      "Just exploring Bitcoin",
    ],
  },
  {
    key: "time_horizon",
    question: "How long can you let this grow?",
    subtext: "The longer the horizon, the more powerful compounding becomes.",
    type: "select" as const,
    options: ["1-2 years", "3-5 years", "5-10 years", "10+ years"],
  },
  {
    key: "risk_tolerance",
    question: "How do you feel about volatility?",
    subtext: "Bitcoin can swing 20% in a week. How does that make you feel?",
    type: "select" as const,
    options: [
      "Keep it safe — I'll sleep better",
      "I can handle some ups and downs",
      "Bring it on — I'm here for the long game",
    ],
  },
];

// ─── Utility ────────────────────────────────────────────────
function formatINR(n: number): string {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)} L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${n.toFixed(0)}`;
}

function allocationColor(product: string): string {
  if (product.includes("BTC")) return "bg-bitcoin";
  if (product.includes("ETH")) return "bg-accent-purple";
  if (product.includes("USDT")) return "bg-accent-green";
  return "bg-accent-blue";
}

function allocationTextColor(product: string): string {
  if (product.includes("BTC")) return "text-bitcoin";
  if (product.includes("ETH")) return "text-accent-purple";
  if (product.includes("USDT")) return "text-accent-green";
  return "text-accent-blue";
}

// ─── Navigation Bar (minimal) ───────────────────────────────
function AutopilotNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-2xl border-b border-border-subtle">
      <div className="max-w-5xl mx-auto px-6 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 bg-bitcoin rounded-lg rotate-45 group-hover:rotate-[55deg] transition-transform duration-500" />
            <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">U</span>
          </div>
          <span className="text-lg font-bold tracking-tight">Autopilot</span>
          <span className="text-xs bg-bitcoin/10 text-bitcoin font-semibold px-2 py-0.5 rounded-full">AI</span>
        </Link>
        <Link href="/" className="text-sm text-text-tertiary hover:text-text-primary transition-colors">
          ← Back to Unocoin
        </Link>
      </div>
    </nav>
  );
}

// ─── Step 1: Welcome ────────────────────────────────────────
function WelcomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen flex items-center justify-center px-6"
    >
      <div className="max-w-2xl text-center">
        {/* Animated icon */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-24 h-24 mx-auto mb-8"
        >
          <div className="absolute inset-0 bg-bitcoin/15 rounded-full blur-2xl animate-pulse-glow" />
          <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-bitcoin to-bitcoin-dark flex items-center justify-center rotate-12">
            <svg className="w-10 h-10 text-white -rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4"
        >
          Tell me your goals.
          <br />
          <span className="gradient-text-bitcoin">I&apos;ll build your strategy.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-lg text-text-secondary max-w-lg mx-auto mb-10 leading-relaxed"
        >
          Autopilot uses AI to design a personalized Bitcoin investment plan —
          tailored to your income, goals, and risk tolerance. Then it executes
          automatically. You don&apos;t have to think about it ever again.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <button onClick={onStart} className="btn-primary text-lg !py-4 !px-10 rounded-xl">
            Design My Strategy
          </button>
          <p className="text-xs text-text-tertiary mt-4">
            Takes 60 seconds · No commitment · Free forever
          </p>
        </motion.div>

        {/* Trust signals */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex flex-wrap items-center justify-center gap-6 mt-14 text-text-tertiary"
        >
          {["AI-Powered", "Auto-Executing", "Starts at ₹10", "Cancel Anytime"].map((item) => (
            <div key={item} className="flex items-center gap-1.5">
              <span className="w-1 h-1 bg-bitcoin rounded-full" />
              <span className="text-xs font-medium">{item}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Step 2: Guided Questions ───────────────────────────────
function OnboardingFlow({
  onComplete,
}: {
  onComplete: (profile: UserProfile) => void;
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const step = STEPS[currentStep];
  const progress = ((currentStep + 1) / STEPS.length) * 100;

  const handleSelect = (value: string) => {
    const newAnswers = { ...answers, [step.key]: value };
    setAnswers(newAnswers);

    if (currentStep < STEPS.length - 1) {
      setTimeout(() => setCurrentStep((s) => s + 1), 300);
    } else {
      // Complete
      setTimeout(() => {
        onComplete(newAnswers as unknown as UserProfile);
      }, 300);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen flex flex-col pt-24 pb-12 px-6"
    >
      {/* Progress bar */}
      <div className="max-w-xl mx-auto w-full mb-12">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-text-tertiary">
            Step {currentStep + 1} of {STEPS.length}
          </span>
          <span className="text-xs text-bitcoin font-medium">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="h-1 bg-surface-elevated rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-bitcoin to-bitcoin-light rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-xl w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
                {step.question}
              </h2>
              <p className="text-text-secondary mb-8">{step.subtext}</p>

              <div className="grid gap-3">
                {step.options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleSelect(option)}
                    className={`text-left px-5 py-4 rounded-xl border transition-all duration-200 group ${
                      answers[step.key] === option
                        ? "bg-bitcoin/10 border-bitcoin/40 text-text-primary"
                        : "bg-surface-card border-border-subtle text-text-secondary hover:border-bitcoin/20 hover:bg-surface-hover"
                    }`}
                  >
                    <span className="text-sm font-medium">{option}</span>
                  </button>
                ))}
              </div>

              {/* Back button */}
              {currentStep > 0 && (
                <button
                  onClick={() => setCurrentStep((s) => s - 1)}
                  className="mt-6 text-sm text-text-tertiary hover:text-text-primary transition-colors"
                >
                  ← Go back
                </button>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Step 3: AI Generating Strategy ─────────────────────────
function GeneratingScreen() {
  const messages = [
    "Analyzing your profile...",
    "Calculating optimal allocation...",
    "Running projection models...",
    "Designing your strategy...",
  ];
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((i) => (i < messages.length - 1 ? i + 1 : i));
    }, 1200);
    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center px-6"
    >
      <div className="text-center">
        {/* Animated orb */}
        <div className="relative w-20 h-20 mx-auto mb-8">
          <motion.div
            className="absolute inset-0 bg-bitcoin/20 rounded-full blur-xl"
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            className="relative w-20 h-20 rounded-full bg-gradient-to-br from-bitcoin to-bitcoin-dark flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          <motion.p
            key={msgIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-lg text-text-secondary"
          >
            {messages[msgIndex]}
          </motion.p>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Step 4: Strategy Dashboard ─────────────────────────────
function StrategyDashboard({
  strategy,
  profile,
  onActivate,
  onRegenerate,
}: {
  strategy: Strategy;
  profile: UserProfile;
  onActivate: () => void;
  onRegenerate: () => void;
}) {
  const [selectedScenario, setSelectedScenario] = useState<"conservative" | "moderate" | "aggressive">("moderate");
  const projections = strategy.projections[selectedScenario];
  const chartRef = useRef<HTMLDivElement>(null);

  // Animated projection values
  const [animatedValues, setAnimatedValues] = useState({ "1y": 0, "3y": 0, "5y": 0, "10y": 0 });

  useEffect(() => {
    const duration = 1500;
    const start = Date.now();
    function animate() {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedValues({
        "1y": projections["1y"] * eased,
        "3y": projections["3y"] * eased,
        "5y": projections["5y"] * eased,
        "10y": projections["10y"] * eased,
      });
      if (progress < 1) requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }, [projections, selectedScenario]);

  // Find max for bar heights
  const maxVal = Math.max(projections["1y"], projections["3y"], projections["5y"], projections["10y"]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-24 pb-20 px-6"
    >
      <div className="max-w-4xl mx-auto">
        {/* Strategy header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-bitcoin/10 border border-bitcoin/20 rounded-full px-4 py-1.5 mb-4">
            <svg className="w-4 h-4 text-bitcoin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
            <span className="text-sm text-bitcoin font-semibold">Your Strategy is Ready</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3">
            <span className="gradient-text-bitcoin">{strategy.strategy_name}</span>
          </h1>
          <p className="text-lg text-text-secondary max-w-xl mx-auto">
            {strategy.summary}
          </p>
        </motion.div>

        {/* Two column layout */}
        <div className="grid lg:grid-cols-5 gap-8 mb-12">
          {/* Allocation breakdown — left col */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-surface-card border border-border-subtle rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-text-tertiary uppercase tracking-wider mb-4">
                Monthly Allocation
              </h3>

              <div className="text-3xl font-bold gradient-text-bitcoin mb-6">
                {formatINR(strategy.monthly_total_inr)}
                <span className="text-sm text-text-tertiary font-normal">/month</span>
              </div>

              {/* Allocation bar */}
              <div className="flex h-3 rounded-full overflow-hidden mb-6">
                {strategy.allocations.map((a, i) => (
                  <motion.div
                    key={i}
                    initial={{ width: 0 }}
                    animate={{ width: `${a.percentage}%` }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.6 }}
                    className={`${allocationColor(a.product)} ${i === 0 ? "rounded-l-full" : ""} ${i === strategy.allocations.length - 1 ? "rounded-r-full" : ""}`}
                  />
                ))}
              </div>

              {/* Allocation cards */}
              <div className="space-y-3">
                {strategy.allocations.map((a, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    className="flex items-center justify-between py-2"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${allocationColor(a.product)}`} />
                      <div>
                        <p className="text-sm font-medium">{a.product}</p>
                        <p className="text-xs text-text-tertiary">{a.frequency}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-semibold ${allocationTextColor(a.product)}`}>
                        {formatINR(a.amount_inr)}
                      </p>
                      <p className="text-xs text-text-tertiary">{a.percentage}%</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Projection chart — right col */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-3"
          >
            <div className="bg-surface-card border border-border-subtle rounded-2xl p-6" ref={chartRef}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-semibold text-text-tertiary uppercase tracking-wider">
                  Growth Projection
                </h3>
                <div className="flex items-center gap-1 bg-surface-elevated rounded-lg p-0.5">
                  {(["conservative", "moderate", "aggressive"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedScenario(s)}
                      className={`text-xs px-3 py-1.5 rounded-md transition-all capitalize ${
                        selectedScenario === s
                          ? "bg-bitcoin text-white font-medium"
                          : "text-text-tertiary hover:text-text-primary"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bar chart */}
              <div className="flex items-end justify-between gap-4 h-[200px] mb-4">
                {(["1y", "3y", "5y", "10y"] as const).map((period, i) => {
                  const height = maxVal > 0 ? (projections[period] / maxVal) * 100 : 0;
                  return (
                    <div key={period} className="flex-1 flex flex-col items-center gap-2">
                      <motion.div className="text-xs font-semibold text-text-primary">
                        {formatINR(animatedValues[period])}
                      </motion.div>
                      <div className="w-full bg-surface-elevated rounded-t-lg overflow-hidden relative" style={{ height: "160px" }}>
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${height}%` }}
                          transition={{ delay: 0.8 + i * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-bitcoin to-bitcoin-light rounded-t-lg"
                        />
                      </div>
                      <span className="text-xs text-text-tertiary font-medium">
                        {period === "1y" ? "1 Year" : period === "3y" ? "3 Years" : period === "5y" ? "5 Years" : "10 Years"}
                      </span>
                    </div>
                  );
                })}
              </div>

              <p className="text-[11px] text-text-tertiary text-center">
                Projections are estimates based on historical returns. Actual results may vary. Not financial advice.
              </p>
            </div>
          </motion.div>
        </div>

        {/* AI Insight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-surface-card border border-border-subtle rounded-2xl p-6 mb-12"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-bitcoin to-bitcoin-dark flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1">Autopilot AI Insight</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{strategy.insight}</p>
            </div>
          </div>
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={onActivate}
            className="btn-primary text-lg !py-4 !px-10 rounded-xl flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
            Activate Autopilot
          </button>
          <button
            onClick={onRegenerate}
            className="btn-secondary !py-4 !px-8 rounded-xl"
          >
            Regenerate Strategy
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Step 5: Activation Confirmation ────────────────────────
function ActivationScreen({ strategy }: { strategy: Strategy }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 800),
      setTimeout(() => setStep(2), 1600),
      setTimeout(() => setStep(3), 2400),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const activationSteps = [
    { label: "Setting up your SBP allocations...", done: step >= 1 },
    { label: "Configuring auto-invest schedule...", done: step >= 2 },
    { label: "Autopilot is live!", done: step >= 3 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center px-6"
    >
      <div className="max-w-md w-full text-center">
        {step < 3 ? (
          <>
            <motion.div
              className="w-16 h-16 mx-auto mb-8 rounded-full bg-gradient-to-br from-bitcoin to-bitcoin-dark flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
            </motion.div>

            <div className="space-y-4 text-left">
              {activationSteps.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.8 }}
                  className="flex items-center gap-3"
                >
                  {s.done ? (
                    <div className="w-6 h-6 rounded-full bg-accent-green flex items-center justify-center shrink-0">
                      <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border border-border-medium shrink-0" />
                  )}
                  <span className={`text-sm ${s.done ? "text-text-primary" : "text-text-tertiary"}`}>
                    {s.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            {/* Success */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-accent-green flex items-center justify-center"
            >
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>

            <h2 className="text-3xl font-bold mb-3">You&apos;re on Autopilot.</h2>
            <p className="text-text-secondary mb-2">
              Your <span className="text-bitcoin font-semibold">{strategy.strategy_name}</span> strategy
              is now active. {formatINR(strategy.monthly_total_inr)}/month is being invested automatically.
            </p>
            <p className="text-sm text-text-tertiary mb-8">
              We&apos;ll send you weekly AI-powered portfolio updates. You can adjust or cancel anytime.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/"
                className="btn-primary !py-3 !px-8 rounded-xl text-sm"
              >
                Back to Unocoin
              </Link>
              <button className="btn-secondary !py-3 !px-8 rounded-xl text-sm">
                View My Portfolio
              </button>
            </div>

            <p className="text-[11px] text-text-tertiary mt-8">
              This is a demo. In production, Autopilot connects to your Unocoin account
              to set up real SBPs. Your engineering team will connect the Unocoin API endpoints.
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Main Page ──────────────────────────────────────────────
export default function AutopilotPage() {
  const [phase, setPhase] = useState<"welcome" | "onboarding" | "generating" | "strategy" | "activating">("welcome");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [strategy, setStrategy] = useState<Strategy | null>(null);

  const generateStrategy = useCallback(async (userProfile: UserProfile) => {
    setPhase("generating");

    try {
      const res = await fetch("/api/autopilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_strategy",
          profile: userProfile,
        }),
      });

      if (!res.ok) throw new Error("API error");

      const data = await res.json();

      if (data.error) throw new Error(data.error);

      setStrategy(data);
      setPhase("strategy");
    } catch {
      // Fallback strategy for demo
      setStrategy({
        strategy_name: "Steady Stacker",
        risk_profile: "moderate",
        summary: "A balanced approach designed for consistent, long-term Bitcoin wealth building.",
        allocations: [
          { product: "BTC SBP", amount_inr: 3000, frequency: "weekly", percentage: 60, rationale: "Core Bitcoin accumulation through disciplined weekly buying" },
          { product: "ETH SBP", amount_inr: 1000, frequency: "weekly", percentage: 20, rationale: "Diversified exposure to Ethereum's ecosystem growth" },
          { product: "USDT Earnings", amount_inr: 1000, frequency: "monthly", percentage: 20, rationale: "Stable 7% APY as your portfolio's safety net" },
        ],
        monthly_total_inr: 5000,
        projections: {
          conservative: { "1y": 62000, "3y": 215000, "5y": 430000, "10y": 1520000 },
          moderate: { "1y": 68000, "3y": 310000, "5y": 780000, "10y": 4200000 },
          aggressive: { "1y": 78000, "3y": 520000, "5y": 1800000, "10y": 15600000 },
        },
        insight: "Based on your profile, a balanced weekly SBP is your strongest move. With ₹5,000/month and a long time horizon, the moderate scenario projects your portfolio growing to ₹42 Lakhs in 10 years. The key is consistency — Bitcoin rewards those who show up every week, not those who time the market.",
      });
      setPhase("strategy");
    }
  }, []);

  const handleOnboardingComplete = (userProfile: UserProfile) => {
    setProfile(userProfile);
    generateStrategy(userProfile);
  };

  return (
    <div className="bg-surface text-text-primary min-h-screen">
      <AutopilotNav />

      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-gradient-radial from-bitcoin/[0.04] via-transparent to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {phase === "welcome" && (
            <WelcomeScreen key="welcome" onStart={() => setPhase("onboarding")} />
          )}

          {phase === "onboarding" && (
            <OnboardingFlow key="onboarding" onComplete={handleOnboardingComplete} />
          )}

          {phase === "generating" && (
            <GeneratingScreen key="generating" />
          )}

          {phase === "strategy" && strategy && (
            <StrategyDashboard
              key="strategy"
              strategy={strategy}
              profile={profile!}
              onActivate={() => setPhase("activating")}
              onRegenerate={() => profile && generateStrategy(profile)}
            />
          )}

          {phase === "activating" && strategy && (
            <ActivationScreen key="activating" strategy={strategy} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
