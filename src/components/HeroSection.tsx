"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

function BitcoinOrb() {
  return (
    <div className="relative w-[300px] h-[300px] md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px]">
      {/* Outer ring glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-bitcoin/20 to-transparent blur-3xl animate-pulse-glow" />

      {/* Rotating orbital rings */}
      <div className="absolute inset-8 md:inset-12 animate-rotate-slow">
        <svg viewBox="0 0 400 400" className="w-full h-full opacity-10">
          <circle
            cx="200"
            cy="200"
            r="180"
            fill="none"
            stroke="#F7931A"
            strokeWidth="0.5"
            strokeDasharray="4 8"
          />
        </svg>
      </div>

      {/* Second ring - reverse */}
      <div
        className="absolute inset-4 md:inset-8"
        style={{ animation: "rotate-slow 45s linear infinite reverse" }}
      >
        <svg viewBox="0 0 400 400" className="w-full h-full opacity-[0.07]">
          <circle
            cx="200"
            cy="200"
            r="190"
            fill="none"
            stroke="#F7931A"
            strokeWidth="0.5"
            strokeDasharray="2 12"
          />
        </svg>
      </div>

      {/* Central Bitcoin symbol */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="relative"
        >
          {/* Glow behind symbol */}
          <div className="absolute inset-0 -m-8 bg-bitcoin/20 rounded-full blur-[60px]" />

          <svg
            viewBox="0 0 64 64"
            className="w-20 h-20 md:w-32 md:h-32 lg:w-40 lg:h-40 relative z-10"
          >
            <defs>
              <linearGradient
                id="btcGrad"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#FFD700" />
                <stop offset="50%" stopColor="#F7931A" />
                <stop offset="100%" stopColor="#E8850F" />
              </linearGradient>
            </defs>
            <text
              x="32"
              y="46"
              textAnchor="middle"
              fill="url(#btcGrad)"
              fontSize="44"
              fontWeight="700"
              fontFamily="Inter, sans-serif"
            >
              ₿
            </text>
          </svg>
        </motion.div>
      </div>

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 md:w-1.5 md:h-1.5 bg-bitcoin rounded-full"
          style={{
            top: `${20 + Math.random() * 60}%`,
            left: `${20 + Math.random() * 60}%`,
          }}
          animate={{
            y: [0, -15, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.4,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function LivePrice() {
  const [price, setPrice] = useState("$84,231");
  const [change] = useState("+2.4%");

  useEffect(() => {
    const interval = setInterval(() => {
      const base = 84231;
      const variance = Math.floor(Math.random() * 500 - 250);
      setPrice(`$${(base + variance).toLocaleString()}`);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 0.6 }}
      className="inline-flex items-center gap-3 bg-surface-elevated/60 backdrop-blur-xl border border-border-subtle rounded-full px-5 py-2.5"
    >
      <div className="w-2 h-2 bg-accent-green rounded-full animate-pulse" />
      <span className="text-sm text-text-secondary">BTC</span>
      <span className="text-sm font-semibold text-text-primary font-mono">
        {price}
      </span>
      <span className="text-sm font-medium text-accent-green">{change}</span>
    </motion.div>
  );
}

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        {/* Top radial gradient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-gradient-radial from-bitcoin/[0.07] via-transparent to-transparent rounded-full blur-3xl" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full pt-32 pb-20 lg:pt-40 lg:pb-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left - Content */}
          <div className="order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-6"
            >
              <LivePrice />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-6"
            >
              Your future
              <br />
              runs on{" "}
              <span className="gradient-text-bitcoin">Bitcoin.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-lg md:text-xl text-text-secondary max-w-lg leading-relaxed mb-10"
            >
              India&apos;s pioneer since 2013. We didn&apos;t just join the
              Bitcoin revolution — we started it. Trusted by millions, backed
              by legends, built for billions.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <a href="#" className="btn-primary text-center text-base">
                Start Your Bitcoin Journey
              </a>
              <a href="#about" className="btn-secondary text-center text-base">
                Our Story
              </a>
            </motion.div>

            {/* Trust bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="mt-14 flex flex-wrap items-center gap-8 text-text-tertiary"
            >
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-accent-green"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm">13 Years of Trust</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-accent-green"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm">Bank-Grade Security</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-accent-green"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm">FIU Registered</span>
              </div>
            </motion.div>
          </div>

          {/* Right - Bitcoin Orb */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 1.2,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.1,
            }}
            className="order-1 lg:order-2 flex justify-center"
          >
            <BitcoinOrb />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
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
