"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "What is Bitcoin?",
  "Is it too late to buy?",
  "What makes Unocoin special?",
  "How does the SBP work?",
  "Tell me about the Supreme Court case",
  "What would ₹500/month in BTC be worth?",
];

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-1.5 h-1.5 bg-bitcoin/60 rounded-full"
          animate={{ y: [0, -4, 0] }}
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

function SatoshiOrb({ onClick, hasUnread }: { onClick: () => void; hasUnread: boolean }) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="relative group"
    >
      {/* Outer glow ring */}
      <div className="absolute inset-0 -m-2 bg-bitcoin/20 rounded-full blur-xl opacity-60 group-hover:opacity-100 transition-opacity animate-pulse-glow" />

      {/* Main orb */}
      <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-bitcoin to-bitcoin-dark flex items-center justify-center shadow-lg shadow-bitcoin/20">
        {/* Bitcoin symbol */}
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
          <text x="12" y="17" textAnchor="middle" fontSize="16" fontWeight="700" fontFamily="Inter, sans-serif">₿</text>
        </svg>

        {/* Sparkle effect on hover */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Notification dot */}
      {hasUnread && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent-green rounded-full border-2 border-surface flex items-center justify-center"
        >
          <span className="text-[8px] font-bold text-white">1</span>
        </motion.div>
      )}

      {/* Tooltip */}
      <div className="absolute bottom-full right-0 mb-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="bg-surface-elevated border border-border-subtle rounded-lg px-3 py-1.5 text-xs text-text-secondary whitespace-nowrap shadow-xl">
          Ask Satoshi anything
          <div className="absolute top-full right-5 -mt-px">
            <div className="w-2 h-2 bg-surface-elevated border-r border-b border-border-subtle rotate-45" />
          </div>
        </div>
      </div>
    </motion.button>
  );
}

function MessageBubble({ message, isLatest }: { message: Message; isLatest: boolean }) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && (
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-bitcoin to-bitcoin-dark flex items-center justify-center mr-2 mt-1 shrink-0">
          <span className="text-[10px] font-bold text-white">₿</span>
        </div>
      )}

      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "bg-bitcoin text-white rounded-br-md"
            : "bg-surface-elevated border border-border-subtle text-text-primary rounded-bl-md"
        }`}
      >
        {/* Render markdown-lite: bold, line breaks */}
        {message.content.split("\n").map((line, i) => (
          <p key={i} className={i > 0 ? "mt-2" : ""}>
            {line.split(/(\*\*.*?\*\*)/).map((part, j) =>
              part.startsWith("**") && part.endsWith("**") ? (
                <strong key={j} className={isUser ? "font-semibold" : "font-semibold text-bitcoin"}>
                  {part.slice(2, -2)}
                </strong>
              ) : (
                <span key={j}>{part}</span>
              )
            )}
          </p>
        ))}
      </div>
    </motion.div>
  );
}

export default function AskSatoshi() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    setShowWelcome(false);
    setHasUnread(false);

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text.trim(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!res.ok) {
        throw new Error("API error");
      }

      const data = await res.json();

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response || "Let me think about that...",
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "I'm having trouble connecting right now. Please try again in a moment — I'm not going anywhere. 😊",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-[360px] sm:w-[400px] h-[560px] bg-surface/95 backdrop-blur-2xl border border-border-subtle rounded-2xl shadow-2xl shadow-black/40 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle bg-surface-elevated/50">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-bitcoin to-bitcoin-dark flex items-center justify-center">
                    <span className="text-sm font-bold text-white">₿</span>
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-accent-green rounded-full border-2 border-surface-elevated" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-text-primary">
                    Ask Satoshi
                  </h3>
                  <p className="text-[11px] text-accent-green font-medium">
                    Online — AI Bitcoin Guide
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-surface-hover flex items-center justify-center transition-colors"
              >
                <svg className="w-4 h-4 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-thin">
              {/* Welcome state */}
              {showWelcome && messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-center py-6"
                >
                  {/* Animated orb */}
                  <div className="relative w-16 h-16 mx-auto mb-5">
                    <div className="absolute inset-0 bg-bitcoin/15 rounded-full blur-xl animate-pulse-glow" />
                    <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-bitcoin to-bitcoin-dark flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">₿</span>
                    </div>
                  </div>

                  <h4 className="text-base font-semibold text-text-primary mb-1">
                    Hey, I&apos;m Satoshi 👋
                  </h4>
                  <p className="text-sm text-text-secondary mb-6 px-4 leading-relaxed">
                    Your AI guide to Bitcoin and Unocoin. Ask me anything — from
                    &ldquo;what is Bitcoin?&rdquo; to &ldquo;what would my SBP be
                    worth in 10 years?&rdquo;
                  </p>

                  {/* Suggestion chips */}
                  <div className="flex flex-wrap justify-center gap-2 px-2">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => sendMessage(s)}
                        className="text-xs bg-surface-elevated border border-border-subtle rounded-full px-3 py-1.5 text-text-secondary hover:text-text-primary hover:border-bitcoin/30 hover:bg-bitcoin/5 transition-all duration-200"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Message bubbles */}
              {messages.map((msg, i) => (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  isLatest={i === messages.length - 1}
                />
              ))}

              {/* Typing indicator */}
              {isLoading && (
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-bitcoin to-bitcoin-dark flex items-center justify-center shrink-0 mt-1">
                    <span className="text-[10px] font-bold text-white">₿</span>
                  </div>
                  <div className="bg-surface-elevated border border-border-subtle rounded-2xl rounded-bl-md">
                    <TypingIndicator />
                  </div>
                </div>
              )}

              {/* Quick follow-ups after a conversation starts */}
              {!showWelcome && !isLoading && messages.length > 0 && messages.length < 6 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-wrap gap-1.5 pt-1"
                >
                  {(messages.length <= 2
                    ? ["How do I get started?", "Tell me more about Unocoin"]
                    : ["What about the SBP?", "Is my money safe?"]
                  ).map((s) => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      className="text-[11px] bg-surface-elevated/60 border border-border-subtle rounded-full px-2.5 py-1 text-text-tertiary hover:text-text-primary hover:border-bitcoin/30 transition-all"
                    >
                      {s}
                    </button>
                  ))}
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <form
              onSubmit={handleSubmit}
              className="px-4 py-3 border-t border-border-subtle bg-surface-elevated/30"
            >
              <div className="flex items-center gap-2 bg-surface-elevated border border-border-subtle rounded-xl px-3 py-1 focus-within:border-bitcoin/30 transition-colors">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything about Bitcoin..."
                  disabled={isLoading}
                  className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-tertiary outline-none py-2"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="w-8 h-8 rounded-lg bg-bitcoin flex items-center justify-center text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-bitcoin-dark transition-colors shrink-0"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
                  </svg>
                </button>
              </div>
              <p className="text-[10px] text-text-tertiary mt-1.5 text-center">
                Powered by AI · Not financial advice
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating orb trigger */}
      <SatoshiOrb
        onClick={() => {
          setIsOpen((prev) => !prev);
          setHasUnread(false);
        }}
        hasUnread={hasUnread && !isOpen}
      />
    </div>
  );
}
