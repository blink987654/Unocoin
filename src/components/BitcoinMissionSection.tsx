"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function BitcoinMissionSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="bitcoin" className="relative py-32 lg:py-48 overflow-hidden">
      {/* Massive background glow */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-bitcoin/[0.04] rounded-full blur-[200px]" />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(rgba(247, 147, 26, 0.3) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div ref={ref} className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-bitcoin/10 border border-bitcoin/20 rounded-full px-5 py-2 mb-8"
        >
          <span className="text-bitcoin text-sm font-semibold">
            Bitcoin is reaching escape velocity
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8 leading-[1.1]"
        >
          Bringing{" "}
          <span className="gradient-text-bitcoin">Bitcoin</span>
          <br />
          to{" "}
          <span className="gradient-text-bitcoin">Billions.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto leading-relaxed mb-12"
        >
          Bitcoin isn&apos;t just an asset — it&apos;s financial sovereignty for 1.4
          billion people. Nation-states are adopting it. Institutions are
          accumulating it. The question isn&apos;t whether Bitcoin will redefine
          money. It&apos;s whether you&apos;ll be part of it.
        </motion.p>

        {/* Key points */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="grid sm:grid-cols-3 gap-8 mb-16 max-w-3xl mx-auto"
        >
          {[
            {
              title: "Digital Gold",
              desc: "Scarce, portable, borderless. Only 21 million will ever exist.",
            },
            {
              title: "Escape Inflation",
              desc: "While fiat currencies debase, Bitcoin offers a fixed monetary policy.",
            },
            {
              title: "Self Sovereignty",
              desc: "Own your wealth. No bank, no government can freeze your Bitcoin.",
            },
          ].map((point, i) => (
            <div key={point.title} className="text-center">
              <h4 className="font-semibold text-lg mb-2">{point.title}</h4>
              <p className="text-sm text-text-secondary leading-relaxed">
                {point.desc}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="relative"
        >
          <div className="bg-surface-card border border-border-subtle rounded-3xl p-8 md:p-12 max-w-3xl mx-auto">
            <blockquote className="text-xl md:text-2xl font-medium leading-relaxed text-text-primary mb-6">
              &ldquo;We started this company with the mission to bring Bitcoin to
              billions. Bitcoin opens up a world that simply wasn&apos;t possible
              before — it has the potential to take market share from gold,
              substantially reduce the cost of remittance, and bank the
              unbanked.&rdquo;
            </blockquote>
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-bitcoin to-bitcoin-light flex items-center justify-center font-bold text-sm text-white">
                SR
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm">Sunny Ray</p>
                <p className="text-xs text-text-tertiary">
                  Co-founder, IndiaBitcoin
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
