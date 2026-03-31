"use client";

import { useState, useMemo, useRef } from "react";
import { motion, useInView } from "framer-motion";

const btcYearlyPrices: Record<number, number> = {
  2013: 13, 2014: 530, 2015: 270, 2016: 570, 2017: 4000, 2018: 7500,
  2019: 7200, 2020: 9500, 2021: 35000, 2022: 28000, 2023: 30000,
  2024: 45000, 2025: 70000, 2026: 85000,
};

const ethYearlyPrices: Record<number, number> = {
  2013: 0, 2014: 0, 2015: 1, 2016: 10, 2017: 360, 2018: 600,
  2019: 180, 2020: 250, 2021: 2800, 2022: 1800, 2023: 1850,
  2024: 2500, 2025: 3200, 2026: 3800,
};

const INR = 83;
const amountSteps = [500, 1000, 2000, 5000, 10000, 25000, 50000, 100000, 500000];

function formatINR(value: number): string {
  if (value >= 1_00_00_000) return `₹${(value / 1_00_00_000).toFixed(2)} Cr`;
  if (value >= 1_00_000) return `₹${(value / 1_00_000).toFixed(2)} L`;
  return `₹${value.toLocaleString("en-IN")}`;
}

function formatAmount(value: number): string {
  if (value >= 100000) return `₹${(value / 100000).toFixed(0)},00,000`;
  if (value >= 1000) return `₹${value.toLocaleString("en-IN")}`;
  return `₹${value}`;
}

type Asset = "BTC" | "ETH" | "Both";

export default function WealthCalculator() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const [amountIndex, setAmountIndex] = useState(4); // 10,000
  const [startYear, setStartYear] = useState(2017);
  const [asset, setAsset] = useState<Asset>("BTC");

  const monthlyAmount = amountSteps[amountIndex];

  const results = useMemo(() => {
    let totalBtc = 0;
    let totalEth = 0;
    const years = 2026 - startYear + 1;
    const totalInvested = monthlyAmount * 12 * years;

    for (let y = startYear; y <= 2026; y++) {
      const yearlyInvest = monthlyAmount * 12;
      if (asset === "BTC" || asset === "Both") {
        const price = btcYearlyPrices[y] || 85000;
        totalBtc += yearlyInvest / (price * INR);
      }
      if (asset === "ETH" || asset === "Both") {
        const price = ethYearlyPrices[y];
        if (price > 0) totalEth += yearlyInvest / (price * INR);
      }
    }

    const currentBtcValue = totalBtc * 85000 * INR;
    const currentEthValue = totalEth * 3800 * INR;

    let currentValue: number;
    if (asset === "BTC") currentValue = currentBtcValue;
    else if (asset === "ETH") currentValue = currentEthValue;
    else currentValue = currentBtcValue + currentEthValue;

    // FD at 6% compound
    let fdValue = 0;
    for (let y = 0; y < years; y++) {
      fdValue = (fdValue + monthlyAmount * 12) * 1.06;
    }

    const returns = totalInvested > 0 ? ((currentValue - totalInvested) / totalInvested) * 100 : 0;

    return { totalInvested, currentValue, returns, fdValue };
  }, [monthlyAmount, startYear, asset]);

  return (
    <section ref={sectionRef} className="relative py-32 lg:py-40">
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-bitcoin/[0.03] rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-block px-4 py-1.5 rounded-full bg-bitcoin/10 text-bitcoin text-sm font-semibold tracking-widest uppercase mb-4"
          >
            Wealth Calculator
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6"
          >
            What if you{" "}
            <span className="gradient-text-bitcoin">started earlier?</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-text-secondary leading-relaxed"
          >
            See how a simple monthly SBP (Systematic Buying Plan) could have grown your wealth. Drag the sliders and watch.
          </motion.p>
        </div>

        {/* Calculator */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="gradient-border bg-surface-card rounded-2xl p-8 lg:p-12"
        >
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Controls */}
            <div className="space-y-10">
              {/* Monthly amount */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="text-text-secondary text-sm font-medium">Monthly Investment</label>
                  <span className="text-2xl font-bold text-bitcoin">{formatAmount(monthlyAmount)}</span>
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
                  <span>₹500</span>
                  <span>₹5,00,000</span>
                </div>
              </div>

              {/* Start year */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="text-text-secondary text-sm font-medium">Start Year</label>
                  <span className="text-2xl font-bold text-bitcoin">{startYear}</span>
                </div>
                <input
                  type="range"
                  min={2013}
                  max={2024}
                  step={1}
                  value={startYear}
                  onChange={(e) => setStartYear(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #F7931A ${((startYear - 2013) / 11) * 100}%, #1a1a2e ${((startYear - 2013) / 11) * 100}%)`,
                    WebkitAppearance: "none",
                  }}
                />
                <div className="flex justify-between mt-2 text-xs text-text-tertiary">
                  <span>2013</span>
                  <span>2024</span>
                </div>
              </div>

              {/* Asset toggle */}
              <div>
                <label className="text-text-secondary text-sm font-medium block mb-4">Asset</label>
                <div className="flex gap-2">
                  {(["BTC", "ETH", "Both"] as Asset[]).map((a) => (
                    <button
                      key={a}
                      onClick={() => setAsset(a)}
                      className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                        asset === a
                          ? "bg-bitcoin text-white shadow-lg shadow-bitcoin/25"
                          : "bg-surface-elevated text-text-secondary hover:text-text-primary border border-border-subtle"
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="flex flex-col justify-center space-y-8">
              <div className="space-y-6">
                {/* Total Invested */}
                <div>
                  <p className="text-text-tertiary text-sm mb-1">Total Invested</p>
                  <motion.p
                    key={results.totalInvested}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="text-2xl font-bold text-text-primary"
                  >
                    {formatINR(results.totalInvested)}
                  </motion.p>
                </div>

                {/* Current Value */}
                <div>
                  <p className="text-text-tertiary text-sm mb-1">Current Value</p>
                  <motion.p
                    key={results.currentValue.toFixed(0)}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="text-4xl lg:text-5xl font-extrabold gradient-text-bitcoin"
                  >
                    {formatINR(results.currentValue)}
                  </motion.p>
                </div>

                {/* Returns */}
                <div>
                  <p className="text-text-tertiary text-sm mb-1">Returns</p>
                  <motion.p
                    key={results.returns.toFixed(0)}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    className="text-3xl font-bold text-accent-green"
                  >
                    +{results.returns.toLocaleString("en-IN", { maximumFractionDigits: 0 })}%
                  </motion.p>
                </div>

                {/* FD Comparison */}
                <div>
                  <p className="text-text-tertiary text-sm mb-1">vs Fixed Deposit (6%)</p>
                  <motion.p
                    key={results.fdValue.toFixed(0)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="text-lg font-semibold text-text-tertiary"
                  >
                    {formatINR(results.fdValue)}
                  </motion.p>
                </div>

                {/* SBP Fee */}
                <div className="pt-2 border-t border-border-subtle">
                  <p className="text-text-tertiary text-sm mb-1">SBP Fee on Unocoin</p>
                  <p className="text-accent-green font-semibold">₹0 (Zero fees on all SBP trades)</p>
                </div>
              </div>

              {/* CTA */}
              <a
                href="https://unocoin.com/in/register"
                className="btn-primary inline-flex items-center justify-center gap-2 w-full text-center text-lg font-semibold py-4 rounded-xl mt-4"
              >
                Start Your SBP Now
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
