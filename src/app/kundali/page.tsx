"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useLocalStorage, formatINR } from "@/lib/hooks";
import { NAKSHATRAS, getNakshatra, NAKSHATRA_IDS } from "@/lib/nakshatras";
import { shareOrDownload, drawRoundedRect } from "@/lib/share-utils";
import type { KundaliResult, NakshatraId } from "@/lib/types";

// ─── Constants ───────────────────────────────────────────────

const EASE_SMOOTH: [number, number, number, number] = [0.16, 1, 0.3, 1];

const QUESTIONS = [
  {
    id: "q1",
    text: "When Bitcoin drops 30%, you...",
    options: ["Buy more", "Hold steady", "Panic a little", "Check Twitter"],
  },
  {
    id: "q2",
    text: "Your ideal investment style is...",
    options: ["Set and forget SBP", "Lump sum on dips", "Active trading", "Research then act"],
  },
  {
    id: "q3",
    text: "What matters most to you?",
    options: ["Financial freedom", "Family security", "Being early", "Understanding money"],
  },
  {
    id: "q4",
    text: "Your Bitcoin journey started...",
    options: ["Before 2017", "2017-2020", "2020-2022", "After 2022"],
  },
  {
    id: "q5",
    text: "If Bitcoin hits \u20B91 Crore, you...",
    options: ["Never sell", "Take some profit", "Retire", "Buy more"],
  },
] as const;

type Phase = "quiz" | "generating" | "results";

// ─── Starfield Background ───────────────────────────────────

function Starfield() {
  const stars = useMemo(() => {
    return Array.from({ length: 48 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 2,
      delay: Math.random() * 4,
    }));
  }, []);

  // Pick ~10 pairs of nearby stars for constellation lines
  const lines = useMemo(() => {
    const result: { x1: number; y1: number; x2: number; y2: number; length: number }[] = [];
    for (let i = 0; i < stars.length - 1 && result.length < 12; i += 4) {
      const a = stars[i];
      const b = stars[i + 1];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const length = Math.sqrt(dx * dx + dy * dy);
      if (length < 30) {
        result.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y, length });
      }
    }
    return result;
  }, [stars]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white/60 animate-star-twinkle"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {lines.map((line, i) => (
          <line
            key={i}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="rgba(168,85,247,0.15)"
            strokeWidth="0.08"
            className="animate-constellation-draw"
            style={{
              "--line-length": `${line.length}`,
              animationDelay: `${i * 0.3}s`,
            } as React.CSSProperties}
          />
        ))}
      </svg>
    </div>
  );
}

// ─── Progress Bar ────────────────────────────────────────────

function ProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <div className="flex justify-between mb-2">
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={`text-xs font-medium ${
              i <= current ? "text-bitcoin" : "text-text-tertiary"
            }`}
          >
            Q{i + 1}
          </span>
        ))}
      </div>
      <div className="h-1 bg-border-subtle rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-bitcoin rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${((current + 1) / total) * 100}%` }}
          transition={{ duration: 0.4, ease: EASE_SMOOTH }}
        />
      </div>
    </div>
  );
}

// ─── Quiz Phase ──────────────────────────────────────────────

function QuizPhase({
  onComplete,
}: {
  onComplete: (answers: Record<string, string>) => void;
}) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = useCallback(
    (option: string) => {
      if (selected) return; // prevent double-click
      setSelected(option);
      const q = QUESTIONS[currentQ];
      const newAnswers = { ...answers, [q.id]: option };
      setAnswers(newAnswers);

      setTimeout(() => {
        if (currentQ < QUESTIONS.length - 1) {
          setCurrentQ((prev) => prev + 1);
          setSelected(null);
        } else {
          onComplete(newAnswers);
        }
      }, 500);
    },
    [currentQ, answers, selected, onComplete]
  );

  const question = QUESTIONS[currentQ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <ProgressBar current={currentQ} total={QUESTIONS.length} />

      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: EASE_SMOOTH }}
          className="w-full max-w-md text-center"
        >
          <h2 className="text-2xl font-bold text-text-primary mb-8">
            {question.text}
          </h2>

          <div className="grid grid-cols-2 gap-3">
            {question.options.map((option) => (
              <motion.button
                key={option}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleSelect(option)}
                className={`px-4 py-4 rounded-xl text-sm font-medium transition-all duration-200 border ${
                  selected === option
                    ? "bg-bitcoin/20 border-bitcoin text-bitcoin"
                    : "bg-surface-card border-border-subtle text-text-secondary hover:border-bitcoin/40 hover:text-text-primary"
                }`}
              >
                {option}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─── Generating Phase ────────────────────────────────────────

function GeneratingPhase() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: EASE_SMOOTH }}
        className="text-center"
      >
        <motion.p
          className="text-2xl font-semibold text-text-primary"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          Reading the stars...
        </motion.p>
        <p className="text-text-tertiary mt-3 text-sm">
          Aligning your cosmic Bitcoin chart
        </p>
      </motion.div>
    </div>
  );
}

// ─── Insight Card ────────────────────────────────────────────

function InsightCard({
  label,
  value,
  emoji,
  delay,
  accentColor,
}: {
  label: string;
  value: string;
  emoji: string;
  delay: number;
  accentColor: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, rotateY: 90 }}
      animate={{ opacity: 1, rotateY: 0 }}
      transition={{ duration: 0.6, delay, ease: EASE_SMOOTH }}
      className="bg-surface-card border border-border-subtle rounded-xl p-5"
      style={{ perspective: 800 }}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">{emoji}</span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: accentColor }}>
            {label}
          </p>
          <p className="text-text-primary text-sm leading-relaxed">{value}</p>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Results Phase ───────────────────────────────────────────

function ResultsPhase({
  result,
  onRetake,
}: {
  result: KundaliResult;
  onRetake: () => void;
}) {
  const nakshatra = getNakshatra(result.nakshatra);
  const cosmicMatch = getNakshatra(result.cosmicMatch);

  const handleShare = useCallback(async () => {
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background
    ctx.fillStyle = "#0A0A0A";
    ctx.fillRect(0, 0, 1200, 630);

    // Subtle gradient overlay
    const gradient = ctx.createRadialGradient(600, 0, 0, 600, 0, 600);
    gradient.addColorStop(0, "rgba(168,85,247,0.08)");
    gradient.addColorStop(1, "transparent");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1200, 630);

    // Branding
    ctx.fillStyle = "#F7931A";
    ctx.font = "bold 24px system-ui, sans-serif";
    ctx.fillText("IndiaBitcoin.com", 60, 60);

    ctx.fillStyle = "#A0A0A0";
    ctx.font = "16px system-ui, sans-serif";
    ctx.fillText("Bitcoin Kundali", 60, 90);

    // Main card area
    drawRoundedRect(ctx, 60, 120, 1080, 400, 20);
    ctx.fillStyle = "#161616";
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Emoji
    ctx.font = "64px system-ui, sans-serif";
    ctx.fillText(nakshatra.emoji, 100, 220);

    // Name + title
    ctx.fillStyle = nakshatra.color;
    ctx.font = "bold 36px system-ui, sans-serif";
    ctx.fillText(nakshatra.name, 100, 280);

    ctx.fillStyle = "#A0A0A0";
    ctx.font = "20px system-ui, sans-serif";
    ctx.fillText(nakshatra.title, 100, 310);

    // Description (wrap text)
    ctx.fillStyle = "#FAFAFA";
    ctx.font = "16px system-ui, sans-serif";
    const words = nakshatra.description.split(" ");
    let line = "";
    let y = 360;
    const maxWidth = 1000;
    for (const word of words) {
      const test = line + word + " ";
      if (ctx.measureText(test).width > maxWidth && line) {
        ctx.fillText(line.trim(), 100, y);
        line = word + " ";
        y += 24;
      } else {
        line = test;
      }
    }
    if (line.trim()) ctx.fillText(line.trim(), 100, y);

    // Footer
    ctx.fillStyle = "#666666";
    ctx.font = "14px system-ui, sans-serif";
    ctx.fillText("Find your Nakshatra at IndiaBitcoin.com/kundali", 60, 590);

    await shareOrDownload(canvas, "Bitcoin Kundali");
  }, [nakshatra]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Main Nakshatra Card */}
      <motion.div
        initial={{ opacity: 0, rotateY: 90 }}
        animate={{ opacity: 1, rotateY: 0 }}
        transition={{ duration: 0.8, ease: EASE_SMOOTH }}
        className="bg-surface-card border border-border-subtle rounded-2xl p-8 text-center mb-8"
        style={{
          perspective: 1000,
          boxShadow: `0 0 80px ${nakshatra.color}10`,
        }}
      >
        <div className="text-[64px] mb-4">{nakshatra.emoji}</div>
        <h2
          className="text-3xl font-bold mb-1"
          style={{ color: nakshatra.color }}
        >
          {nakshatra.name}
        </h2>
        <p className="text-text-secondary text-lg mb-4">{nakshatra.title}</p>
        <p className="text-text-secondary text-sm leading-relaxed max-w-md mx-auto">
          {nakshatra.description}
        </p>
      </motion.div>

      {/* Insight Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
        <InsightCard
          label="Your Strength"
          value={result.strength}
          emoji="💪"
          delay={0.3}
          accentColor={nakshatra.color}
        />
        <InsightCard
          label="Blind Spot"
          value={result.blindSpot}
          emoji="👁️"
          delay={0.5}
          accentColor={nakshatra.color}
        />
        <InsightCard
          label="Auspicious Time"
          value={result.auspiciousTime}
          emoji="🕐"
          delay={0.7}
          accentColor={nakshatra.color}
        />
        <InsightCard
          label="Cosmic Match"
          value={`${cosmicMatch.emoji} ${cosmicMatch.name} — ${cosmicMatch.title}`}
          emoji="🤝"
          delay={0.9}
          accentColor={nakshatra.color}
        />
        <InsightCard
          label="2026 Prediction"
          value={result.prediction2026}
          emoji="🔮"
          delay={1.1}
          accentColor={nakshatra.color}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, ease: EASE_SMOOTH }}
          onClick={handleShare}
          className="px-6 py-3 bg-bitcoin text-black font-semibold rounded-xl hover:bg-bitcoin/90 transition-colors"
        >
          Share Your Kundali
        </motion.button>
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, ease: EASE_SMOOTH }}
          onClick={onRetake}
          className="px-6 py-3 bg-surface-card border border-border-subtle text-text-secondary font-semibold rounded-xl hover:text-text-primary hover:border-bitcoin/40 transition-colors"
        >
          Retake Quiz
        </motion.button>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────

export default function KundaliPage() {
  const [storedResult, setStoredResult] = useLocalStorage<KundaliResult | null>(
    "uno_kundali_result",
    null
  );
  const [phase, setPhase] = useState<Phase>(storedResult ? "results" : "quiz");
  const [result, setResult] = useState<KundaliResult | null>(storedResult);

  const handleQuizComplete = useCallback(
    async (answers: Record<string, string>) => {
      setPhase("generating");

      try {
        const res = await fetch("/api/kundali", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers }),
        });

        if (!res.ok) throw new Error("API error");
        const data: KundaliResult = await res.json();
        setResult(data);
        setStoredResult(data);
        setPhase("results");
      } catch {
        // Fallback: generate a deterministic result from answers
        const hash = Object.values(answers).join("").length;
        const idx = hash % NAKSHATRA_IDS.length;
        const matchIdx = (idx + 3) % NAKSHATRA_IDS.length;
        const fallback: KundaliResult = {
          nakshatra: NAKSHATRA_IDS[idx],
          strength: "Unwavering conviction in sound money principles",
          blindSpot: "Sometimes too focused on price to enjoy the journey",
          auspiciousTime: "The next full moon in a bear market",
          cosmicMatch: NAKSHATRA_IDS[matchIdx],
          prediction2026: "A year of steady accumulation that pays off beyond expectations",
          generatedAt: Date.now(),
        };
        setResult(fallback);
        setStoredResult(fallback);
        setPhase("results");
      }
    },
    [setStoredResult]
  );

  const handleRetake = useCallback(() => {
    setResult(null);
    setStoredResult(null);
    setPhase("quiz");
  }, [setStoredResult]);

  return (
    <div
      className="min-h-screen bg-surface text-text-primary relative"
      style={{
        backgroundImage:
          "radial-gradient(ellipse at 50% 0%, rgba(168,85,247,0.08) 0%, transparent 70%)",
      }}
    >
      <Starfield />
      <Navigation />

      <main className="relative z-10 pt-24 pb-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_SMOOTH }}
          className="text-center mb-12 px-4"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-3">
            Bitcoin Kundali
          </h1>
          <p className="text-text-secondary max-w-lg mx-auto">
            Discover your cosmic Bitcoin investor personality. Answer 5 questions
            and the stars will reveal your Nakshatra.
          </p>
        </motion.div>

        {/* Phase Content */}
        <AnimatePresence mode="wait">
          {phase === "quiz" && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <QuizPhase onComplete={handleQuizComplete} />
            </motion.div>
          )}

          {phase === "generating" && (
            <motion.div
              key="generating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <GeneratingPhase />
            </motion.div>
          )}

          {phase === "results" && result && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ResultsPhase result={result} onRetake={handleRetake} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
