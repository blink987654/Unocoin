"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef, useMemo, Suspense } from "react";
import dynamic from "next/dynamic";

// Lazy load the 3D globe so it doesn't block initial render
const BitcoinGlobe = dynamic(() => import("./BitcoinGlobe"), {
  ssr: false,
  loading: () => (
    <div className="w-[300px] h-[300px] md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] flex items-center justify-center">
      <div className="w-32 h-32 rounded-full bg-bitcoin/10 animate-pulse-glow" />
    </div>
  ),
});

// ─── Types ───────────────────────────────────────────────────
interface PriceData {
  symbol: string;
  name: string;
  price: number;
  change1h: number;
  change24h: number;
  marketCap: number;
}

// ─── Dynamic Personalization (#10) ──────────────────────────
function usePersonalization() {
  const [context, setContext] = useState({
    greeting: "The future of money",
    subtext: "starts here.",
    timeOfDay: "day" as "morning" | "day" | "evening" | "night",
    isReturning: false,
  });

  useEffect(() => {
    const hour = new Date().getHours();
    const visited = localStorage.getItem("unocoin_visited");
    const isReturning = !!visited;
    localStorage.setItem("unocoin_visited", "true");

    let timeOfDay: "morning" | "day" | "evening" | "night" = "day";
    if (hour >= 5 && hour < 12) timeOfDay = "morning";
    else if (hour >= 12 && hour < 17) timeOfDay = "day";
    else if (hour >= 17 && hour < 21) timeOfDay = "evening";
    else timeOfDay = "night";

    let greeting = "The future of money";
    let subtext = "starts here.";

    if (isReturning) {
      switch (timeOfDay) {
        case "morning": greeting = "Good morning."; subtext = "Your portfolio awaits."; break;
        case "day": greeting = "Welcome back."; subtext = "Let's build wealth."; break;
        case "evening": greeting = "Good evening."; subtext = "Bitcoin never sleeps."; break;
        case "night": greeting = "Still up?"; subtext = "So is Bitcoin."; break;
      }
    }

    setContext({ greeting, subtext, timeOfDay, isReturning });
  }, []);

  return context;
}

// ─── Live Prices from CoinMarketCap (#1) ────────────────────
function useLivePrices() {
  const [prices, setPrices] = useState<PriceData[]>([
    { symbol: "BTC", name: "Bitcoin", price: 84231, change1h: 0.12, change24h: 2.4, marketCap: 1670000000000 },
    { symbol: "ETH", name: "Ethereum", price: 3245, change1h: -0.05, change24h: 1.8, marketCap: 390000000000 },
    { symbol: "USDT", name: "Tether", price: 1.0, change1h: 0.0, change24h: 0.01, marketCap: 140000000000 },
    { symbol: "USDC", name: "USD Coin", price: 1.0, change1h: 0.0, change24h: 0.0, marketCap: 52000000000 },
  ]);

  useEffect(() => {
    async function fetchPrices() {
      try {
        const res = await fetch("/api/prices");
        if (res.ok) {
          const data = await res.json();
          setPrices(data);
        }
      } catch {
        // Keep fallback data
      }
    }
    fetchPrices();
    const interval = setInterval(fetchPrices, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  return prices;
}

function PriceTicker({ prices }: { prices: PriceData[] }) {
  const symbolIcons: Record<string, string> = {
    BTC: "₿",
    ETH: "Ξ",
    USDT: "₮",
    USDC: "$",
  };

  const symbolColors: Record<string, string> = {
    BTC: "text-bitcoin",
    ETH: "text-accent-purple",
    USDT: "text-accent-green",
    USDC: "text-accent-blue",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.6 }}
      className="flex flex-wrap items-center gap-4 md:gap-6"
    >
      <div className="flex items-center gap-2 mr-2">
        <div className="w-2 h-2 bg-accent-green rounded-full animate-pulse" />
        <span className="text-xs text-text-tertiary uppercase tracking-wider font-medium">Live</span>
      </div>
      {prices.map((p) => (
        <div
          key={p.symbol}
          className="flex items-center gap-2 bg-surface-elevated/40 backdrop-blur-xl border border-border-subtle rounded-lg px-3 py-1.5 hover:border-border-medium transition-colors"
        >
          <span className={`text-sm font-bold ${symbolColors[p.symbol] || "text-text-primary"}`}>
            {symbolIcons[p.symbol] || p.symbol}
          </span>
          <span className="text-xs text-text-secondary font-medium">{p.symbol}</span>
          <span className="text-xs font-semibold text-text-primary font-mono">
            ${p.price < 2 ? p.price.toFixed(4) : p.price.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </span>
          <span
            className={`text-xs font-medium ${
              p.change24h >= 0 ? "text-accent-green" : "text-red-400"
            }`}
          >
            {p.change24h >= 0 ? "+" : ""}
            {p.change24h.toFixed(1)}%
          </span>
        </div>
      ))}
    </motion.div>
  );
}

// ─── Investment Calculator Counter (#4) ─────────────────────
function InvestmentCounter() {
  const [displayValue, setDisplayValue] = useState(0);
  // ₹1,000/month since Jan 2013 in BTC
  // Approximate: ~₹1.56 Crore based on historical BTC/INR
  const targetValue = 15600000;

  useEffect(() => {
    const duration = 2500;
    const start = Date.now();

    function animate() {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.floor(targetValue * eased));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    const timeout = setTimeout(() => {
      requestAnimationFrame(animate);
    }, 1500);

    return () => clearTimeout(timeout);
  }, []);

  const formatted = `₹${(displayValue / 10000000).toFixed(2)} Cr`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.8, duration: 0.6 }}
      className="bg-surface-card/50 backdrop-blur-xl border border-border-subtle rounded-2xl p-5 max-w-sm"
    >
      <p className="text-xs text-text-tertiary uppercase tracking-wider mb-2">
        If you invested ₹1,000/month since 2013
      </p>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl md:text-4xl font-bold gradient-text-bitcoin font-mono">
          {formatted}
        </span>
      </div>
      <p className="text-xs text-text-tertiary mt-1.5">
        Total invested: ₹1.56L · That&apos;s a <span className="text-bitcoin font-semibold">100x return</span>
      </p>
    </motion.div>
  );
}

// ─── Social Proof Activity Feed (#6) ────────────────────────
const activityMessages = [
  { city: "Mumbai", action: "bought ₹25,000 BTC", icon: "₿" },
  { city: "Bangalore", action: "activated Bitcoin SBP", icon: "⚡" },
  { city: "Delhi", action: "received Lightning payment", icon: "⚡" },
  { city: "Pune", action: "bought ₹5,000 ETH", icon: "Ξ" },
  { city: "Chennai", action: "withdrew BTC to cold storage", icon: "🔒" },
  { city: "Hyderabad", action: "set up ₹500/week SBP", icon: "📈" },
  { city: "Kolkata", action: "bought ₹10,000 BTC", icon: "₿" },
  { city: "Ahmedabad", action: "earned 7% on USDT", icon: "💰" },
  { city: "Jaipur", action: "sent remittance via Lightning", icon: "⚡" },
  { city: "Kochi", action: "bought ₹1,000 BTC", icon: "₿" },
];

function SocialProofTicker() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activityMessages.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const msg = activityMessages[currentIndex];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2.5 }}
      className="flex items-center gap-3 bg-surface-elevated/30 backdrop-blur-xl border border-border-subtle rounded-full px-4 py-2"
    >
      <div className="w-2 h-2 bg-accent-green rounded-full animate-pulse" />
      <AnimatePresence mode="wait">
        <motion.span
          key={currentIndex}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="text-xs text-text-secondary"
        >
          <span className="text-text-tertiary">{msg.icon}</span>{" "}
          Someone in <span className="text-text-primary font-medium">{msg.city}</span>{" "}
          {msg.action}
        </motion.span>
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Inline Signup (#8) ─────────────────────────────────────
function InlineSignup() {
  const [phone, setPhone] = useState("");
  const [focused, setFocused] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.9 }}
    >
      <div
        className={`flex items-center gap-2 bg-surface-elevated/60 backdrop-blur-xl rounded-xl border transition-all duration-300 p-1.5 max-w-md ${
          focused ? "border-bitcoin/40 shadow-[0_0_30px_rgba(247,147,26,0.1)]" : "border-border-subtle"
        }`}
      >
        <div className="flex items-center gap-2 pl-3 text-text-tertiary">
          <span className="text-sm">🇮🇳</span>
          <span className="text-sm font-medium">+91</span>
        </div>
        <input
          type="tel"
          placeholder="Enter your mobile number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-tertiary outline-none py-2.5 px-2"
        />
        <button className="btn-primary !py-2.5 !px-5 !rounded-lg text-sm whitespace-nowrap">
          Get Started
        </button>
      </div>
      <p className="text-xs text-text-tertiary mt-2.5 ml-1">
        Free account. No minimum balance. Start your SBP from ₹10.
      </p>
    </motion.div>
  );
}

// ─── Investor Trust Anchors (#9) ────────────────────────────
function InvestorBadges() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.4, duration: 0.8 }}
      className="flex flex-wrap items-center gap-3 mt-8"
    >
      <span className="text-xs text-text-tertiary uppercase tracking-wider mr-1">Backed by</span>
      <div className="flex items-center gap-1.5 bg-surface-elevated/40 border border-border-subtle rounded-lg px-3 py-1.5">
        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-bitcoin to-bitcoin-light flex items-center justify-center text-[8px] font-bold text-white">
          TD
        </div>
        <span className="text-xs text-text-secondary font-medium">Tim Draper</span>
      </div>
      <div className="flex items-center gap-1.5 bg-surface-elevated/40 border border-border-subtle rounded-lg px-3 py-1.5">
        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center text-[8px] font-bold text-white">
          BS
        </div>
        <span className="text-xs text-text-secondary font-medium">Barry Silbert</span>
      </div>
      <div className="flex items-center gap-1.5 bg-surface-elevated/40 border border-border-subtle rounded-lg px-3 py-1.5">
        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-accent-green to-accent-blue flex items-center justify-center text-[8px] font-bold text-white">
          BV
        </div>
        <span className="text-xs text-text-secondary font-medium">Blume Ventures</span>
      </div>
    </motion.div>
  );
}

// ─── Bitcoin Lifeline — Background Price Chart (#11) ────────
function BitcoinLifeline() {
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);
  const [showMilestones, setShowMilestones] = useState(false);

  // BTC price history 2013-2026, normalized to SVG viewBox (0 0 1200 300)
  // Y is inverted (0 = top = high price, 300 = bottom = low price)
  // Price range: $0 → $84,000 mapped to 290 → 10
  const priceToY = (price: number) => 290 - (price / 84000) * 280;

  const dataPoints = useMemo(() => [
    { x: 0,    price: 100,   year: 2013 },    // Unocoin Founded
    { x: 70,   price: 300,   year: 2014 },
    { x: 140,  price: 430,   year: 2015 },
    { x: 210,  price: 960,   year: 2016 },
    { x: 300,  price: 19000, year: 2017 },    // First big peak
    { x: 370,  price: 3200,  year: 2018 },    // RBI Ban crash
    { x: 440,  price: 7200,  year: 2019 },
    { x: 500,  price: 5000,  year: 2020.0 },  // COVID crash
    { x: 540,  price: 10500, year: 2020.3 },  // Supreme Court Victory recovery
    { x: 620,  price: 29000, year: 2020.9 },
    { x: 720,  price: 69000, year: 2021 },    // ATH
    { x: 810,  price: 16000, year: 2022 },    // Bear market
    { x: 900,  price: 42000, year: 2023 },
    { x: 990,  price: 70000, year: 2024 },
    { x: 1080, price: 76000, year: 2025 },
    { x: 1200, price: 84000, year: 2026 },    // Today
  ], []);

  // Build smooth SVG path using cubic bezier curves
  const linePath = useMemo(() => {
    const pts = dataPoints.map(d => ({ x: d.x, y: priceToY(d.price) }));
    let path = `M ${pts[0].x} ${pts[0].y}`;

    for (let i = 1; i < pts.length; i++) {
      const prev = pts[i - 1];
      const curr = pts[i];
      const cpx1 = prev.x + (curr.x - prev.x) * 0.4;
      const cpx2 = prev.x + (curr.x - prev.x) * 0.6;
      path += ` C ${cpx1} ${prev.y}, ${cpx2} ${curr.y}, ${curr.x} ${curr.y}`;
    }

    return path;
  }, [dataPoints]);

  // Area fill path (line path + close to bottom)
  const areaPath = useMemo(() => {
    return `${linePath} L 1200 300 L 0 300 Z`;
  }, [linePath]);

  // Milestones
  const milestones = useMemo(() => [
    { x: 0,    y: priceToY(100),   label: "Founded", sublabel: "2013" },
    { x: 370,  y: priceToY(3200),  label: "RBI Ban", sublabel: "2018" },
    { x: 540,  y: priceToY(10500), label: "Supreme Court", sublabel: "Victory 2020" },
    { x: 1200, y: priceToY(84000), label: "Today", sublabel: "$84K+", isPulsing: true },
  ], []);

  useEffect(() => {
    if (pathRef.current) {
      const len = pathRef.current.getTotalLength();
      setPathLength(len);
      // Show milestones after line finishes drawing
      const timer = setTimeout(() => setShowMilestones(true), 4200);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="absolute bottom-0 left-0 right-0 h-[45vh] md:h-[50vh] pointer-events-none">
      <svg
        viewBox="0 0 1200 300"
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        <defs>
          {/* Gradient for the line stroke — fades in from left to right */}
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F7931A" stopOpacity="0.04" />
            <stop offset="30%" stopColor="#F7931A" stopOpacity="0.08" />
            <stop offset="70%" stopColor="#F7931A" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#F7931A" stopOpacity="0.18" />
          </linearGradient>

          {/* Gradient for area fill — subtle bottom fade */}
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F7931A" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#F7931A" stopOpacity="0" />
          </linearGradient>

          {/* Glow filter for the line */}
          <filter id="lineGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Area fill — appears instantly but very subtle */}
        <path
          d={areaPath}
          fill="url(#areaGradient)"
          className={pathLength ? "animate-draw-line" : ""}
          style={pathLength ? {
            "--path-length": `${pathLength}`,
          } as React.CSSProperties : undefined}
          opacity={0.6}
        />

        {/* Main line with draw animation */}
        <path
          ref={pathRef}
          d={linePath}
          fill="none"
          stroke="url(#lineGradient)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#lineGlow)"
          className={pathLength ? "animate-draw-line" : ""}
          style={pathLength ? {
            "--path-length": `${pathLength}`,
          } as React.CSSProperties : undefined}
        />

        {/* Milestone markers — fade in after line draws */}
        {showMilestones && milestones.map((m, i) => (
          <g
            key={m.label}
            className="animate-milestone"
            style={{ animationDelay: `${i * 0.3}s` }}
          >
            {/* Dot */}
            <circle
              cx={m.x}
              cy={m.y}
              r={m.isPulsing ? 5 : 3}
              fill="#F7931A"
              opacity={m.isPulsing ? 0.6 : 0.35}
              className={m.isPulsing ? "animate-pulse-glow" : ""}
            />

            {/* Outer ring for pulsing dot */}
            {m.isPulsing && (
              <circle
                cx={m.x}
                cy={m.y}
                r={10}
                fill="none"
                stroke="#F7931A"
                strokeWidth="1"
                opacity={0.2}
                className="animate-pulse-glow"
              />
            )}

            {/* Vertical tick line */}
            <line
              x1={m.x}
              y1={m.y + (m.y > 150 ? -8 : 8)}
              x2={m.x}
              y2={m.y + (m.y > 150 ? -22 : 22)}
              stroke="#F7931A"
              strokeWidth="0.5"
              opacity={0.2}
            />

            {/* Label */}
            <text
              x={m.x}
              y={m.y + (m.y > 150 ? -28 : 32)}
              textAnchor={m.x < 50 ? "start" : m.x > 1150 ? "end" : "middle"}
              fill="#666666"
              fontSize="9"
              fontFamily="Inter, sans-serif"
              fontWeight="500"
            >
              {m.label}
            </text>

            {/* Sublabel */}
            <text
              x={m.x}
              y={m.y + (m.y > 150 ? -18 : 43)}
              textAnchor={m.x < 50 ? "start" : m.x > 1150 ? "end" : "middle"}
              fill="#444444"
              fontSize="8"
              fontFamily="Inter, sans-serif"
              fontWeight="400"
            >
              {m.sublabel}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

// ─── Cinematic Background (#7) ──────────────────────────────
function CinematicBackground({ timeOfDay }: { timeOfDay: string }) {
  const ambientColor = useMemo(() => {
    switch (timeOfDay) {
      case "morning": return "from-bitcoin/[0.05] via-bitcoin/[0.02]";
      case "evening": return "from-bitcoin/[0.08] via-orange-900/[0.03]";
      case "night": return "from-accent-purple/[0.04] via-accent-blue/[0.02]";
      default: return "from-bitcoin/[0.06] via-transparent";
    }
  }, [timeOfDay]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Ambient gradient based on time of day */}
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[1400px] h-[1000px] bg-gradient-radial ${ambientColor} to-transparent rounded-full blur-3xl`} />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Bitcoin Lifeline — price history chart drawing animation */}
      <BitcoinLifeline />

      {/* Moving gradient orbs for cinematic depth */}
      <motion.div
        className="absolute top-[20%] right-[10%] w-[400px] h-[400px] bg-bitcoin/[0.03] rounded-full blur-[100px]"
        animate={{
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[10%] left-[5%] w-[300px] h-[300px] bg-accent-blue/[0.03] rounded-full blur-[80px]"
        animate={{
          x: [0, -20, 0],
          y: [0, 15, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Radial light beam from center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[600px] bg-gradient-to-b from-bitcoin/[0.02] via-transparent to-transparent rotate-[15deg] blur-[60px]" />
    </div>
  );
}

// ─── Main Hero (#3 headline, #5 scroll transition) ──────────
export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const prices = useLivePrices();
  const personalization = usePersonalization();

  // Scroll-triggered transitions (#5)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, -60]);
  const globeScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.15]);
  const globeOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center overflow-hidden">
      {/* Cinematic Background (#7) */}
      <CinematicBackground timeOfDay={personalization.timeOfDay} />

      <motion.div
        style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
        className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full pt-28 pb-16 lg:pt-36 lg:pb-24"
      >
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-4 items-center">
          {/* Left - Content */}
          <div className="order-2 lg:order-1 space-y-6">
            {/* Live Price Ticker (#1) */}
            <PriceTicker prices={prices} />

            {/* Social Proof (#6) */}
            <SocialProofTicker />

            {/* Dynamic Headline (#3 + #10) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight">
                {personalization.greeting}
                <br />
                <span className="gradient-text-bitcoin">{personalization.subtext}</span>
              </h1>
            </motion.div>

            {/* Subheadline with stakes (#3) */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-lg md:text-xl text-text-secondary max-w-lg leading-relaxed"
            >
              India&apos;s first crypto platform fought the RBI in the Supreme Court
              — and won. Since 2013, we&apos;ve been the guide for 2.26 million
              Indians building wealth with Bitcoin and 120+ cryptocurrencies.
            </motion.p>

            {/* Inline Signup (#8) */}
            <InlineSignup />

            {/* Investor Badges (#9) */}
            <InvestorBadges />

            {/* Trust bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6, duration: 0.8 }}
              className="flex flex-wrap items-center gap-6 text-text-tertiary pt-2"
            >
              {[
                { label: "Since 2013", icon: "🕐" },
                { label: "120+ Cryptos", icon: "🪙" },
                { label: "Lightning Network", icon: "⚡" },
                { label: "FIU Registered", icon: "✓" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-1.5">
                  <span className="text-xs">{item.icon}</span>
                  <span className="text-xs font-medium">{item.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right - 3D Globe (#2) + Investment Counter (#4) */}
          <motion.div
            style={{ scale: globeScale, opacity: globeOpacity }}
            className="order-1 lg:order-2 flex flex-col items-center gap-4"
          >
            <Suspense
              fallback={
                <div className="w-[300px] h-[300px] md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full bg-bitcoin/10 animate-pulse-glow" />
                </div>
              }
            >
              <BitcoinGlobe />
            </Suspense>

            {/* Investment Calculator (#4) */}
            <InvestmentCounter />
          </motion.div>
        </div>

      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3 }}
        style={{ opacity: heroOpacity }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 rounded-full border border-border-medium flex items-start justify-center p-2"
        >
          <div className="w-1 h-2 bg-text-tertiary rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
