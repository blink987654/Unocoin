"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Navigation from "@/components/Navigation";

// ─── Types ────────────────────────────────────────────────────
interface SuggestedAction {
  label: string;
  type: "buy" | "sell" | "rebalance" | "increase_sbp" | "lock";
  detail: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  suggestedActions?: SuggestedAction[];
  timestamp: number;
}

// ─── Demo Portfolio Data ──────────────────────────────────────
const holdings = [
  { asset: "BTC", qty: "0.0425", value: 298138, allocation: 61.8 },
  { asset: "ETH", qty: "0.85", value: 112500, allocation: 23.3 },
  { asset: "USDT", qty: "500", value: 42000, allocation: 8.7 },
  { asset: "SOL", qty: "2.5", value: 29712, allocation: 6.2 },
];
const totalValue = 482350;
const sbpActive = true;
const sbpMonthly = 5000;
const streakDays = 47;

const portfolio = { holdings, totalValue, sbpActive, sbpMonthly, streakDays };

// ─── Donut chart colors ───────────────────────────────────────
const ASSET_COLORS: Record<string, string> = {
  BTC: "#F7931A",
  ETH: "#627EEA",
  USDT: "#26A17B",
  SOL: "#9945FF",
};

// ─── Easing ───────────────────────────────────────────────────
const easing: [number, number, number, number] = [0.16, 1, 0.3, 1];

// ─── Time-of-day greeting ─────────────────────────────────────
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

// ─── Format INR ───────────────────────────────────────────────
function formatINR(value: number): string {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)}L`;
  return `₹${value.toLocaleString("en-IN")}`;
}

// ─── Storage key ──────────────────────────────────────────────
const STORAGE_KEY = "uno_advisor_history";

function loadHistory(): Message[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Message[];
    return parsed.slice(-20);
  } catch {
    return [];
  }
}

function saveHistory(messages: Message[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-20)));
  } catch {
    // Storage full or unavailable — silently ignore
  }
}

// ─── Animated Count-Up ────────────────────────────────────────
function CountUp({ target, duration = 1.2 }: { target: number; duration?: number }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let start = 0;
    const startTime = performance.now();

    function step(now: number) {
      const elapsed = Math.min((now - startTime) / (duration * 1000), 1);
      // Ease out cubic
      const progress = 1 - Math.pow(1 - elapsed, 3);
      const current = Math.round(progress * target);
      if (current !== start) {
        start = current;
        setValue(current);
      }
      if (elapsed < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }, [target, duration]);

  return <span ref={ref}>{formatINR(value)}</span>;
}

// ─── Donut Chart (SVG) ───────────────────────────────────────
function DonutChart({
  data,
}: {
  data: Array<{ asset: string; allocation: number }>;
}) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  let cumulativeOffset = 0;

  return (
    <svg viewBox="0 0 140 140" className="w-full h-full">
      {data.map((item) => {
        const strokeLength = (item.allocation / 100) * circumference;
        const offset = cumulativeOffset;
        cumulativeOffset += strokeLength;

        return (
          <circle
            key={item.asset}
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            stroke={ASSET_COLORS[item.asset] || "#555"}
            strokeWidth="16"
            strokeDasharray={`${strokeLength} ${circumference - strokeLength}`}
            strokeDashoffset={-offset}
            strokeLinecap="round"
            className="transition-all duration-700"
            style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
          />
        );
      })}
      <text
        x="70"
        y="66"
        textAnchor="middle"
        className="fill-text-primary text-sm font-semibold"
        fontSize="14"
      >
        {formatINR(totalValue)}
      </text>
      <text
        x="70"
        y="82"
        textAnchor="middle"
        className="fill-text-tertiary"
        fontSize="10"
      >
        Total Value
      </text>
    </svg>
  );
}

// ─── Typing Indicator ─────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full bg-bitcoin/60"
          animate={{ y: [0, -6, 0] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// ─── Action Button ────────────────────────────────────────────
function ActionButton({ action }: { action: SuggestedAction }) {
  const [executed, setExecuted] = useState(false);

  const typeIcons: Record<string, string> = {
    buy: "↗",
    sell: "↘",
    rebalance: "⟲",
    increase_sbp: "↑",
    lock: "🔒",
  };

  return (
    <motion.button
      onClick={() => setExecuted(true)}
      className={`
        mt-2 mr-2 inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium
        transition-all duration-300 cursor-pointer
        ${
          executed
            ? "bg-accent-green/15 border border-accent-green/40 text-accent-green"
            : "bg-bitcoin/5 border border-bitcoin/30 text-bitcoin hover:bg-bitcoin/10 hover:border-bitcoin/50"
        }
      `}
      whileTap={{ scale: 0.96 }}
    >
      {executed ? (
        <motion.span
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          ✓
        </motion.span>
      ) : (
        <span>{typeIcons[action.type] || "→"}</span>
      )}
      <span>{executed ? "Executed!" : action.label}</span>
    </motion.button>
  );
}

// ─── Chat Message ─────────────────────────────────────────────
function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: easing }}
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-bitcoin/15 flex items-center justify-center mr-3 mt-1 shrink-0">
          <span className="text-bitcoin text-sm font-bold">A</span>
        </div>
      )}
      <div
        className={`max-w-[80%] ${
          isUser
            ? "bg-bitcoin/10 border border-bitcoin/20 rounded-2xl rounded-br-md"
            : "bg-surface-card border border-border-subtle rounded-2xl rounded-bl-md"
        } px-4 py-3`}
      >
        <p className="text-text-primary text-sm leading-relaxed whitespace-pre-wrap">
          {message.content}
        </p>
        {message.suggestedActions && message.suggestedActions.length > 0 && (
          <div className="mt-2 flex flex-wrap">
            {message.suggestedActions.map((action, i) => (
              <ActionButton key={i} action={action} />
            ))}
          </div>
        )}
        <span className="block mt-1.5 text-[10px] text-text-tertiary">
          {new Date(message.timestamp).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </motion.div>
  );
}

// ─── Portfolio Sidebar ────────────────────────────────────────
function PortfolioSidebar() {
  return (
    <motion.aside
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: easing, delay: 0.2 }}
      className="hidden lg:flex flex-col w-[40%] border-l border-border-subtle bg-surface-elevated/30 overflow-y-auto"
    >
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-lg font-semibold text-text-primary">
            Your Portfolio
          </h2>
          <p className="text-text-tertiary text-sm mt-1">Demo account</p>
        </div>

        {/* Total Value */}
        <div className="bg-surface-card border border-border-subtle rounded-2xl p-5">
          <p className="text-text-secondary text-xs uppercase tracking-wider mb-1">
            Total Value
          </p>
          <p className="text-2xl font-bold text-text-primary">
            <CountUp target={totalValue} />
          </p>
          <p className="text-accent-green text-sm mt-1 font-medium">
            +2.4% today
          </p>
        </div>

        {/* Donut Chart */}
        <div className="bg-surface-card border border-border-subtle rounded-2xl p-5">
          <p className="text-text-secondary text-xs uppercase tracking-wider mb-4">
            Allocation
          </p>
          <div className="w-36 h-36 mx-auto">
            <DonutChart data={holdings} />
          </div>
        </div>

        {/* Holdings List */}
        <div className="bg-surface-card border border-border-subtle rounded-2xl p-5">
          <p className="text-text-secondary text-xs uppercase tracking-wider mb-3">
            Holdings
          </p>
          <div className="space-y-3">
            {holdings.map((h) => (
              <div key={h.asset} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: ASSET_COLORS[h.asset] || "#555",
                    }}
                  />
                  <div>
                    <p className="text-text-primary text-sm font-medium">
                      {h.asset}
                    </p>
                    <p className="text-text-tertiary text-xs">{h.qty}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-text-primary text-sm font-medium">
                    {formatINR(h.value)}
                  </p>
                  <p className="text-text-tertiary text-xs">
                    {h.allocation}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SBP Status */}
        <div className="bg-surface-card border border-border-subtle rounded-2xl p-5">
          <p className="text-text-secondary text-xs uppercase tracking-wider mb-2">
            SBP Status
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
            <p className="text-text-primary text-sm font-medium">
              Active &middot; ₹{sbpMonthly.toLocaleString("en-IN")}/mo &middot;
              Day {streakDays} streak
            </p>
          </div>
          <div className="mt-3 w-full bg-surface-hover rounded-full h-1.5">
            <motion.div
              className="h-1.5 rounded-full bg-bitcoin"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((streakDays / 90) * 100, 100)}%` }}
              transition={{ duration: 1.2, ease: easing, delay: 0.5 }}
            />
          </div>
          <p className="text-text-tertiary text-xs mt-1.5">
            {90 - streakDays} days to 90-day milestone
          </p>
        </div>

        {/* Link to full portfolio */}
        <Link
          href="/portfolio"
          className="block text-center text-bitcoin text-sm font-medium hover:text-bitcoin-light transition-colors py-3"
        >
          View Full Portfolio →
        </Link>
      </div>
    </motion.aside>
  );
}

// ─── Main Page ────────────────────────────────────────────────
export default function AdvisorPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  // Load history from localStorage
  useEffect(() => {
    const saved = loadHistory();
    if (saved.length > 0) {
      setMessages(saved);
      setInitialized(true);
    }
  }, []);

  // Save history when messages change
  useEffect(() => {
    if (messages.length > 0) {
      saveHistory(messages);
    }
  }, [messages]);

  // Send initial proactive message
  useEffect(() => {
    if (initialized) return;

    const savedHistory = loadHistory();
    if (savedHistory.length > 0) {
      setInitialized(true);
      return;
    }

    setInitialized(true);
    sendInitialMessage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialized]);

  async function sendInitialMessage() {
    setIsLoading(true);

    const greeting = getGreeting();
    const initialPrompt = `The user just opened the Advisor page. Send a proactive ${greeting.toLowerCase()} greeting. Review their portfolio and highlight one specific insight or opportunity. Be warm, specific with numbers, and suggest one clear action.`;

    try {
      const res = await fetch("/api/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: initialPrompt }],
          portfolio,
        }),
      });

      const data = await res.json();

      if (data.response) {
        const aiMessage: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.response,
          suggestedActions: data.suggestedActions,
          timestamp: Date.now(),
        };
        setMessages([aiMessage]);
      }
    } catch {
      const fallbackMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: `${getGreeting()}! I've reviewed your portfolio. You're sitting at ₹4.82L with a solid 62% Bitcoin allocation. Your 47-day SBP streak is impressive — keep it going! I notice your USDT is just sitting idle. Want me to help you move it to earn 7% APY?`,
        suggestedActions: [
          {
            label: "Earn 7% on USDT",
            type: "rebalance",
            detail: "Move ₹42,000 USDT to Earnings",
          },
        ],
        timestamp: Date.now(),
      };
      setMessages([fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSend() {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      timestamp: Date.now(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    // Resize textarea back
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }

    try {
      // Build API messages — strip suggestedActions, only send role+content
      const apiMessages = updatedMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages, portfolio }),
      });

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const aiMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.response,
        suggestedActions: data.suggestedActions,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch {
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          "I hit a snag processing that. Could you try again in a moment?",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleTextareaInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value);
    // Auto-resize
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  }

  function clearHistory() {
    localStorage.removeItem(STORAGE_KEY);
    setMessages([]);
    setInitialized(false);
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Navigation />

      {/* Page wrapper below nav */}
      <div className="flex-1 flex flex-col pt-20">
        {/* Top bar */}
        <div className="border-b border-border-subtle bg-surface-elevated/50 px-4 sm:px-6 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-bitcoin/15 flex items-center justify-center">
                <span className="text-bitcoin font-bold text-sm">A</span>
              </div>
              <div>
                <h1 className="text-text-primary font-semibold text-base">
                  AI Wealth Advisor
                </h1>
                <p className="text-text-tertiary text-xs">
                  Powered by Claude &middot; Personalized for your portfolio
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={clearHistory}
                className="text-text-tertiary hover:text-text-secondary text-xs transition-colors cursor-pointer"
              >
                Clear chat
              </button>
              <Link
                href="/portfolio"
                className="lg:hidden text-bitcoin text-xs font-medium hover:text-bitcoin-light transition-colors"
              >
                Portfolio →
              </Link>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 flex max-w-7xl mx-auto w-full overflow-hidden">
          {/* Chat area */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
              {messages.length === 0 && !isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-full text-center py-20"
                >
                  <div className="w-16 h-16 rounded-full bg-bitcoin/10 flex items-center justify-center mb-4">
                    <span className="text-bitcoin text-2xl font-bold">A</span>
                  </div>
                  <h2 className="text-text-primary text-lg font-semibold mb-2">
                    AI Wealth Advisor
                  </h2>
                  <p className="text-text-secondary text-sm max-w-md">
                    Your personal wealth advisor, trained on your portfolio.
                    Ask anything about your investments, allocation, or strategy.
                  </p>
                </motion.div>
              )}

              <AnimatePresence mode="popLayout">
                {messages.map((msg) => (
                  <ChatMessage key={msg.id} message={msg} />
                ))}
              </AnimatePresence>

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start mb-4"
                >
                  <div className="w-8 h-8 rounded-full bg-bitcoin/15 flex items-center justify-center mr-3 shrink-0">
                    <span className="text-bitcoin text-sm font-bold">A</span>
                  </div>
                  <div className="bg-surface-card border border-border-subtle rounded-2xl rounded-bl-md">
                    <TypingIndicator />
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="border-t border-border-subtle bg-surface-elevated/30 px-4 sm:px-6 py-4">
              <div className="max-w-3xl mx-auto">
                <div className="flex items-end gap-3">
                  <div className="flex-1 bg-surface-card border border-border-subtle rounded-xl px-4 py-3 focus-within:border-bitcoin/40 transition-colors">
                    <textarea
                      ref={inputRef}
                      value={input}
                      onChange={handleTextareaInput}
                      onKeyDown={handleKeyDown}
                      placeholder="Ask about your portfolio, allocation, or strategy..."
                      rows={1}
                      className="w-full bg-transparent text-text-primary text-sm placeholder:text-text-tertiary outline-none resize-none max-h-[120px]"
                    />
                  </div>
                  <motion.button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    whileTap={{ scale: 0.94 }}
                    className={`
                      shrink-0 w-10 h-10 rounded-xl flex items-center justify-center
                      transition-all duration-200 cursor-pointer
                      ${
                        input.trim() && !isLoading
                          ? "bg-bitcoin text-white hover:bg-bitcoin-dark"
                          : "bg-surface-card text-text-tertiary border border-border-subtle"
                      }
                    `}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 2L11 13" />
                      <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                    </svg>
                  </motion.button>
                </div>
                <p className="text-text-tertiary text-[10px] mt-2 text-center">
                  AI-powered insights for education only. Not financial advice.
                  Always do your own research.
                </p>
              </div>
            </div>
          </div>

          {/* Portfolio sidebar — desktop only */}
          <PortfolioSidebar />
        </div>
      </div>
    </div>
  );
}
