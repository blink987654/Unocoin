"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef, useMemo, Suspense } from "react";
import dynamic from "next/dynamic";

// Lazy load the 3D globe so it doesn't block initial render
const BitcoinGlobe = dynamic(() => import("./BitcoinGlobe"), {
  ssr: false,
  loading: () => (
    <div className="w-[260px] h-[260px] md:w-[400px] md:h-[400px] lg:w-[480px] lg:h-[480px] flex items-center justify-center">
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
    subtext: "starts here",
    description: "India\u2019s first Bitcoin platform fought the RBI in the Supreme Court \u2014 and won. Since 2013, we\u2019ve been the guide for 2.26 million Indians building wealth with Bitcoin, stablecoins, and 120+ digital assets.",
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

    // Headline + subtext pairs for first-time visitors (rotated randomly)
    const firstTimeHeadlines = [
      { greeting: "Own digital gold", subtext: "the decade\u2019s best asset", description: "Bitcoin has outperformed every asset class of the last decade. Auto-invest with zero fees from just \u20B910. India\u2019s most trusted platform since 2013." },
      { greeting: "Bitcoin SBP", subtext: "at 0% fees", description: "Systematic Buying Plan for Bitcoin \u2014 India\u2019s first. Auto-invest daily, weekly, or monthly. Zero transaction fees. Start from just \u20B910. No lock-in." },
      { greeting: "India\u2019s most trusted", subtext: "Bitcoin platform", description: "We fought the RBI in the Supreme Court \u2014 and won. 2.26 million Indians trust us with their Bitcoin. \u20B93,000 Cr+ processed. 13 years. Zero breaches." },
      { greeting: "Bitcoin is digital gold", subtext: "start from \u20B910", description: "The best-performing asset of the last decade. Buy Bitcoin instantly via UPI, earn 7% on stablecoins, and send via Lightning \u2014 all on one platform." },
      { greeting: "Bitcoin at lightning speed", subtext: "for a fraction of a rupee", description: "Send and receive Bitcoin in milliseconds via Lightning Network. Cross-border remittances that settle in seconds, not days. Powered by Voltage." },
    ];

    // Headline + subtext pairs for returning visitors (time-aware)
    const returningHeadlines: Record<string, { greeting: string; subtext: string; description: string }[]> = {
      morning: [
        { greeting: "Good morning", subtext: "stack more Bitcoin", description: "Your Bitcoin portfolio is waiting. Check your holdings, top up your SBP, or explore new opportunities. Digital gold doesn\u2019t sleep." },
        { greeting: "Rise and stack", subtext: "Bitcoin before chai", description: "Markets never sleep, and neither does your Bitcoin SBP. Your automated buys have been running while you rested." },
      ],
      day: [
        { greeting: "Welcome back", subtext: "Bitcoin is moving", description: "2.26 million Indians are building wealth with Bitcoin on Unocoin. Check the markets, review your portfolio, or increase your SBP." },
        { greeting: "Digital gold", subtext: "is always open", description: "Live Bitcoin prices, instant trades, and your SBP running on autopilot. The decade\u2019s best-performing asset, available 24/7." },
      ],
      evening: [
        { greeting: "Good evening", subtext: "Bitcoin never rests", description: "Wind down while your Bitcoin works. Review today\u2019s performance, or set up an Auto Sell to catch overnight moves." },
        { greeting: "While you rest", subtext: "Bitcoin keeps working", description: "Your Bitcoin SBP runs around the clock. Digital gold doesn\u2019t follow banking hours. Check your portfolio or adjust your strategy." },
      ],
      night: [
        { greeting: "The night owls", subtext: "stack the most Bitcoin", description: "Smart money moves while the world sleeps. Check live Bitcoin prices, adjust your SBP, or explore new opportunities." },
        { greeting: "Still stacking", subtext: "digital gold", description: "The best investors are always building. Your Bitcoin portfolio is live 24/7. The decade\u2019s best asset doesn\u2019t take nights off." },
      ],
    };

    let headline;
    if (isReturning) {
      const options = returningHeadlines[timeOfDay];
      headline = options[Math.floor(Math.random() * options.length)];
    } else {
      headline = firstTimeHeadlines[Math.floor(Math.random() * firstTimeHeadlines.length)];
    }

    setContext({
      greeting: headline.greeting,
      subtext: headline.subtext,
      description: headline.description,
      timeOfDay,
      isReturning,
    });
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
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-surface-elevated/40 transition-colors"
        >
          <span className={`text-sm font-bold ${symbolColors[p.symbol] || "text-text-primary"}`}>
            {symbolIcons[p.symbol] || p.symbol}
          </span>
          <span className="text-xs text-text-secondary font-medium">{p.symbol}</span>
          <span className="text-xs font-semibold text-text-primary font-mono">
            ₹{p.price < 2 ? (p.price * 83).toFixed(2) : (p.price * 83).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
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


// ─── Feature Highlight Stats ────────────────────────────────
function FeatureHighlights() {
  const highlights = [
    { stat: "₹0", label: "SBP Fees" },
    { stat: "7%", label: "APY" },
    { stat: "<1s", label: "Lightning" },
    { stat: "₹10", label: "Minimum" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.0, duration: 0.8 }}
      className="flex items-center gap-6 lg:gap-10"
    >
      {highlights.map((h, i) => (
        <motion.div
          key={h.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 + i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="cursor-default"
        >
          <span className="text-xl lg:text-2xl font-bold gradient-text-bitcoin block">{h.stat}</span>
          <span className="text-xs text-text-tertiary uppercase tracking-wider">{h.label}</span>
        </motion.div>
      ))}
    </motion.div>
  );
}

// ─── Investor Spotlight (Rotating Quotes) ───────────────────
const investorQuotes = [
  {
    quote: "Unocoin has solidified its position as the leading Bitcoin company in India.",
    name: "Barry Silbert",
    title: "Founder, Digital Currency Group",
    initials: "BS",
    gradient: "from-accent-blue to-accent-purple",
  },
  {
    quote: "India is going to be one of the biggest Bitcoin markets in the world. Unocoin is leading that charge.",
    name: "Tim Draper",
    title: "Legendary VC & Bitcoin Pioneer",
    initials: "TD",
    gradient: "from-bitcoin to-bitcoin-light",
  },
];

function InvestorSpotlight() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % investorQuotes.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const quote = investorQuotes[index];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.4, duration: 0.8 }}
      className="mt-6"
    >
      <div className="max-w-md">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-sm text-text-secondary italic leading-relaxed mb-3">
              &ldquo;{quote.quote}&rdquo;
            </p>
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${quote.gradient} flex items-center justify-center text-[10px] font-bold text-white`}>
                {quote.initials}
              </div>
              <div>
                <p className="text-xs font-semibold text-text-primary">{quote.name}</p>
                <p className="text-xs text-text-tertiary">{quote.title}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Live Trading Metrics ───────────────────────────────────
function LiveMetrics() {
  const [metrics, setMetrics] = useState({
    tradedToday: 234,
    activeUsers: 12450,
    aum: 890,
  });

  useEffect(() => {
    // Subtle increments to feel alive
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        tradedToday: prev.tradedToday + Math.random() * 0.3,
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 5),
        aum: prev.aum + Math.random() * 0.01,
      }));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.8, duration: 0.6 }}
      className="bg-surface-card/40 backdrop-blur-xl rounded-2xl p-5 max-w-sm"
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 bg-accent-green rounded-full animate-pulse" />
        <span className="text-xs text-text-tertiary uppercase tracking-wider font-medium">Live Platform Activity</span>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <span className="text-xl font-bold gradient-text-bitcoin font-mono block">
            ₹{metrics.tradedToday.toFixed(0)} Cr
          </span>
          <span className="text-[10px] text-text-tertiary">Traded today</span>
        </div>
        <div>
          <span className="text-xl font-bold gradient-text-bitcoin font-mono block">
            {metrics.activeUsers.toLocaleString("en-IN")}
          </span>
          <span className="text-[10px] text-text-tertiary">Active users</span>
        </div>
        <div>
          <span className="text-xl font-bold gradient-text-bitcoin font-mono block">
            ₹{metrics.aum.toFixed(0)} Cr
          </span>
          <span className="text-[10px] text-text-tertiary">AUM</span>
        </div>
      </div>
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
        className={`flex items-center gap-2 bg-surface-elevated/60 backdrop-blur-xl rounded-xl transition-all duration-300 p-1.5 max-w-md ${
          focused ? "shadow-[0_0_30px_rgba(247,147,26,0.15)]" : ""
        }`}
      >
        <div className="flex items-center gap-2 pl-3 text-text-tertiary">
          <span className="text-sm font-medium text-text-secondary">+91</span>
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


// ─── Bitcoin Lifeline — Background Price Chart (#11) ────────
function BitcoinLifeline() {
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);
  const [showMilestones, setShowMilestones] = useState(false);

  // BTC price history 2013-2026, normalized to SVG viewBox (0 0 1200 300)
  // Y is inverted (0 = top = high price, 300 = bottom = low price)
  // Price range: ₹0 → ₹70L mapped to 290 → 10
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
    { x: 1200, y: priceToY(84000), label: "Today", sublabel: "₹70L+", isPulsing: true },
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
    <div className="absolute bottom-0 left-0 right-0 h-[25vh] md:h-[30vh] pointer-events-none opacity-60">
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

        {/* Milestone dots only (no text — text rendered as HTML to avoid stretching) */}
        {showMilestones && milestones.map((m, i) => (
          <g
            key={m.label}
            className="animate-milestone"
            style={{ animationDelay: `${i * 0.3}s` }}
          >
            <circle
              cx={m.x}
              cy={m.y}
              r={m.isPulsing ? 5 : 3}
              fill="#F7931A"
              opacity={m.isPulsing ? 0.6 : 0.35}
              className={m.isPulsing ? "animate-pulse-glow" : ""}
            />
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
            <line
              x1={m.x}
              y1={m.y + (m.y > 150 ? -8 : 8)}
              x2={m.x}
              y2={m.y + (m.y > 150 ? -22 : 22)}
              stroke="#F7931A"
              strokeWidth="0.5"
              opacity={0.2}
            />
          </g>
        ))}
      </svg>

      {/* Milestone labels as HTML to avoid horizontal stretching */}
      {showMilestones && milestones.map((m, i) => {
        const xPercent = (m.x / 1200) * 100;
        const yPercent = (m.y / 300) * 100;
        const above = m.y > 150;
        return (
          <div
            key={m.label}
            className="absolute animate-milestone"
            style={{
              left: `${xPercent}%`,
              top: `${yPercent}%`,
              transform: `translate(${m.x < 50 ? '0%' : m.x > 1150 ? '-100%' : '-50%'}, ${above ? '-100%' : '20%'})`,
              animationDelay: `${i * 0.3}s`,
            }}
          >
            <p
              className="text-[9px] font-medium whitespace-nowrap"
              style={{ color: '#666666' }}
            >
              {m.label}
            </p>
            <p
              className="text-[8px] whitespace-nowrap"
              style={{ color: '#444444' }}
            >
              {m.sublabel}
            </p>
          </div>
        );
      })}
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
        className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full pt-28 pb-12 lg:pt-32 lg:pb-16"
      >
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-4 items-center">
          {/* Left - Content */}
          <div className="order-2 lg:order-1 space-y-4">
            {/* Dynamic Headline (#3 + #10) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            >
              <h1 className="text-display">
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
              className="text-base md:text-lg text-text-secondary max-w-lg leading-relaxed"
            >
              {personalization.description}
            </motion.p>

            {/* Feature Highlight Cards */}
            <FeatureHighlights />

            {/* Inline Signup (#8) */}
            <InlineSignup />

            {/* Trust line */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="text-xs text-text-tertiary"
            >
              FIU-IND Registered · Supreme Court Validated · 95% Cold Storage
            </motion.p>
          </div>

          {/* Right - 3D Globe (#2) + Investment Counter (#4) */}
          <motion.div
            style={{ scale: globeScale, opacity: globeOpacity }}
            className="order-1 lg:order-2 flex flex-col items-center gap-4"
          >
            <Suspense
              fallback={
                <div className="w-[260px] h-[260px] md:w-[400px] md:h-[400px] lg:w-[480px] lg:h-[480px] flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full bg-bitcoin/10 animate-pulse-glow" />
                </div>
              }
            >
              <BitcoinGlobe />
            </Suspense>

            {/* Live Trading Metrics */}
            <LiveMetrics />
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
