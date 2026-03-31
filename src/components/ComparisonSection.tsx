"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const competitors = ["Unocoin", "WazirX", "CoinDCX", "Binance", "Coinbase"] as const;

const rows: { feature: string; values: string[]; highlight?: boolean }[] = [
  { feature: "Founded", values: ["2013", "2018", "2018", "2017", "2012"] },
  { feature: "SBP (Crypto SIP)", values: ["✓ 0% fee", "✗", "✗", "✗", "✓ (fees apply)"] },
  { feature: "OTC Desk", values: ["✓", "✗", "✓", "✓", "✓"] },
  { feature: "Lightning Network", values: ["✓", "✗", "✗", "✗", "✗"] },
  { feature: "Crypto Lending", values: ["✓", "✗", "✗", "✓", "✗"] },
  { feature: "FIU-IND Registered", values: ["✓", "✗", "✓", "✗", "✗"] },
  { feature: "Supreme Court Validated", values: ["✓", "✗", "✗", "✗", "✗"], highlight: true },
  { feature: "Cold Storage", values: ["95%", "Unknown", "Unknown", "~90%", "98%"] },
  { feature: "Maker Fee", values: ["0.2%", "0.1%", "0.1%", "0.1%", "0.4%"] },
  { feature: "Min Investment", values: ["₹10", "₹100", "₹100", "₹100", "~₹100"] },
  { feature: "Backed by Tim Draper", values: ["✓", "✗", "✗", "✗", "✓"] },
  { feature: "Trusted by Govt Entities", values: ["✓", "✗", "✗", "✗", "✗"], highlight: true },
];

function CellValue({ value, isUnocoin }: { value: string; isUnocoin: boolean }) {
  if (value === "✓" || value.startsWith("✓"))
    return <span className="text-accent-green font-medium">{value}</span>;
  if (value === "✗")
    return <span className="text-red-400/50">{value}</span>;
  return <span className={isUnocoin ? "text-text-primary font-medium" : "text-text-secondary"}>{value}</span>;
}

export default function ComparisonSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-32 lg:py-40 bg-surface">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-bitcoin/10 text-bitcoin border border-bitcoin/20 mb-6">
            Why Unocoin
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-text-primary mb-6">
            See how we{" "}
            <span className="gradient-text-bitcoin">compare.</span>
          </h2>
          <p className="text-text-secondary text-lg max-w-3xl mx-auto leading-relaxed">
            The only Indian crypto platform that survived the RBI ban, won the Supreme Court,
            and earned Tim Draper&apos;s backing. Here&apos;s how we stack up.
          </p>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="gradient-border rounded-2xl bg-surface-card overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-sm">
              <thead>
                <tr className="border-b border-border-subtle">
                  <th className="sticky left-0 z-10 bg-surface-card px-6 py-4 text-left text-text-tertiary font-medium w-48">
                    Feature
                  </th>
                  {competitors.map((name, i) => (
                    <th
                      key={name}
                      className={`px-5 py-4 text-center font-semibold ${
                        i === 0
                          ? "gradient-text-bitcoin text-base bg-bitcoin/5 border-l-2 border-bitcoin/30"
                          : "text-text-secondary"
                      }`}
                    >
                      {name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rowIdx) => (
                  <motion.tr
                    key={row.feature}
                    initial={{ opacity: 0, x: -10 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.35, delay: 0.3 + rowIdx * 0.05 }}
                    className={`border-b border-border-subtle last:border-b-0 transition-colors hover:bg-surface-elevated/50 ${
                      row.highlight ? "bg-bitcoin/[0.03]" : ""
                    }`}
                  >
                    <td className="sticky left-0 z-10 bg-surface-card px-6 py-3.5 text-text-primary font-medium whitespace-nowrap">
                      {row.feature}
                      {row.highlight && (
                        <span className="ml-2 inline-block w-1.5 h-1.5 rounded-full bg-bitcoin" />
                      )}
                    </td>
                    {row.values.map((val, colIdx) => (
                      <td
                        key={colIdx}
                        className={`px-5 py-3.5 text-center whitespace-nowrap ${
                          colIdx === 0 ? "bg-bitcoin/5 border-l-2 border-bitcoin/30" : ""
                        }`}
                      >
                        <CellValue value={val} isUnocoin={colIdx === 0} />
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Differentiator callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="mt-8 rounded-xl bg-surface-elevated border border-border-subtle px-6 py-5 text-center max-w-3xl mx-auto"
        >
          <p className="text-text-secondary text-sm leading-relaxed">
            <span className="text-bitcoin font-semibold">Unocoin</span> is the only crypto
            platform in India to be validated by the{" "}
            <span className="text-text-primary font-medium">Supreme Court of India</span> and
            trusted by sovereign institutions.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
