"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

const amountSteps = [1000, 5000, 10000, 25000, 50000, 100000, 500000, 1000000];

const tradeTypes = [
  { label: "SBP (0%)", rate: 0 },
  { label: "Maker (0.2%)", rate: 0.002 },
  { label: "Taker (0.3%)", rate: 0.003 },
  { label: "Instant BTC (0.5%)", rate: 0.005 },
] as const;

const COMPETITOR_RATE = 0.005;

function formatINR(value: number): string {
  if (value >= 1_00_00_000) return `₹${(value / 1_00_00_000).toFixed(2)} Cr`;
  if (value >= 1_00_000) return `₹${(value / 1_00_000).toFixed(2)} L`;
  return `₹${value.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

function formatAmount(value: number): string {
  return `₹${value.toLocaleString("en-IN")}`;
}

export default function FeeCalculator() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const [amountIndex, setAmountIndex] = useState(2); // 10,000
  const [tradeTypeIndex, setTradeTypeIndex] = useState(0); // SBP

  const tradeAmount = amountSteps[amountIndex];
  const selectedType = tradeTypes[tradeTypeIndex];
  const fee = tradeAmount * selectedType.rate;
  const competitorFee = tradeAmount * COMPETITOR_RATE;
  const savings = competitorFee - fee;
  const isSBP = selectedType.rate === 0;

  return (
    <section ref={sectionRef} className="relative py-32 lg:py-40">
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-bitcoin/[0.03] rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-block px-4 py-1.5 rounded-full bg-bitcoin/10 text-bitcoin text-sm font-semibold tracking-widest uppercase mb-4"
          >
            Fee Transparency
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6"
          >
            Know <span className="gradient-text-bitcoin">exactly</span> what you&apos;ll pay.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-text-secondary leading-relaxed"
          >
            No surprises. No hidden fees. Calculate your trading costs instantly.
          </motion.p>
        </div>

        {/* Calculator Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="gradient-border bg-surface-card rounded-2xl p-8 lg:p-12"
        >
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Controls */}
            <div className="space-y-10">
              {/* Trade Amount Slider */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="text-text-secondary text-sm font-medium">Trade Amount</label>
                  <span className="text-2xl font-bold text-bitcoin">{formatAmount(tradeAmount)}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={amountSteps.length - 1}
                  step={1}
                  value={amountIndex}
                  onChange={(e) => setAmountIndex(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #F7931A ${(amountIndex / (amountSteps.length - 1)) * 100}%, #1a1a2e ${(amountIndex / (amountSteps.length - 1)) * 100}%)`,
                    WebkitAppearance: "none",
                  }}
                />
                <div className="flex justify-between mt-2 text-xs text-text-tertiary">
                  <span>₹1,000</span>
                  <span>₹10,00,000</span>
                </div>
              </div>

              {/* Trade Type Selector */}
              <div>
                <label className="text-text-secondary text-sm font-medium block mb-4">Trade Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {tradeTypes.map((type, i) => (
                    <button
                      key={type.label}
                      onClick={() => setTradeTypeIndex(i)}
                      className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                        tradeTypeIndex === i
                          ? "bg-bitcoin text-white shadow-lg shadow-bitcoin/25"
                          : "bg-surface-elevated text-text-secondary hover:text-text-primary border border-border-subtle"
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="flex flex-col justify-center space-y-8">
              <div className="space-y-6">
                {/* Your Fee */}
                <div>
                  <p className="text-text-tertiary text-sm mb-1">Your Fee</p>
                  <motion.p
                    key={`${fee}-${tradeTypeIndex}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className={`text-4xl lg:text-5xl font-extrabold ${isSBP ? "gradient-text-bitcoin" : "text-text-primary"}`}
                  >
                    {isSBP ? "₹0" : formatINR(fee)}
                  </motion.p>
                  {isSBP && (
                    <p className="text-accent-green text-sm font-semibold mt-1">Zero fees on SBP trades!</p>
                  )}
                </div>

                {/* Effective Rate */}
                <div>
                  <p className="text-text-tertiary text-sm mb-1">Effective Rate</p>
                  <motion.p
                    key={selectedType.rate}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="text-2xl font-bold text-text-primary"
                  >
                    {(selectedType.rate * 100).toFixed(1)}%
                  </motion.p>
                </div>

                {/* Competitor Average */}
                <div>
                  <p className="text-text-tertiary text-sm mb-1">Competitor Average</p>
                  <motion.p
                    key={competitorFee}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="text-lg font-semibold text-text-tertiary"
                  >
                    {formatINR(competitorFee)} <span className="text-sm font-normal">(0.5%)</span>
                  </motion.p>
                </div>

                {/* You Save */}
                <div>
                  <p className="text-text-tertiary text-sm mb-1">You Save</p>
                  <motion.p
                    key={savings}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    className="text-3xl font-bold text-accent-green"
                  >
                    {formatINR(savings)}
                  </motion.p>
                </div>

                {/* Disclaimer */}
                <div className="pt-2 border-t border-border-subtle">
                  <p className="text-text-tertiary text-xs leading-relaxed">
                    + 18% IGST on fees, + 1% TDS on sell trades as per law
                  </p>
                </div>
              </div>

              {/* CTA */}
              <a
                href="https://unocoin.com/in/register"
                className="btn-primary inline-flex items-center justify-center gap-2 w-full text-center text-lg font-semibold py-4 rounded-xl mt-4"
              >
                Start Trading
                <span className="ml-1">&rarr;</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Slider thumb styling */}
      <style jsx>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #F7931A;
          cursor: pointer;
          box-shadow: 0 0 12px rgba(247, 147, 26, 0.5);
          border: 3px solid #fff;
          transition: box-shadow 0.2s ease;
        }
        input[type="range"]::-webkit-slider-thumb:hover {
          box-shadow: 0 0 20px rgba(247, 147, 26, 0.7);
        }
        input[type="range"]::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #F7931A;
          cursor: pointer;
          box-shadow: 0 0 12px rgba(247, 147, 26, 0.5);
          border: 3px solid #fff;
        }
        input[type="range"]::-moz-range-track {
          height: 8px;
          border-radius: 9999px;
        }
      `}</style>
    </section>
  );
}
