"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const partners = [
  "Banking Partners",
  "Payment Networks",
  "NBFC Partners",
  "Global Corridors",
];

export default function RemittanceSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="remittance" className="relative py-32 lg:py-40 overflow-hidden">
      {/* Background */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-blue/[0.04] rounded-full blur-[150px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div
          ref={ref}
          className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center"
        >
          {/* Left - Visual */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            {/* Flow visualization */}
            <div className="relative bg-surface-card rounded-3xl border border-border-subtle p-8 md:p-12 overflow-hidden">
              {/* Animated flow lines */}
              <div className="absolute inset-0 opacity-[0.05]">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute h-px bg-gradient-to-r from-transparent via-accent-blue to-transparent"
                    style={{
                      top: `${20 + i * 15}%`,
                      left: "-10%",
                      right: "-10%",
                    }}
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{
                      duration: 4 + i,
                      repeat: Infinity,
                      delay: i * 0.5,
                      ease: "linear",
                    }}
                  />
                ))}
              </div>

              <div className="relative z-10">
                {/* From */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center text-2xl">
                    🇺🇸
                  </div>
                  <div>
                    <p className="text-sm text-text-tertiary">Sending from</p>
                    <p className="font-semibold text-lg">United States</p>
                    <p className="text-sm text-text-secondary font-mono">
                      $1,000 USDC
                    </p>
                  </div>
                </div>

                {/* Flow arrow */}
                <div className="flex items-center gap-4 my-6 ml-6">
                  <div className="flex-1 h-px bg-gradient-to-r from-accent-blue/30 to-accent-green/30" />
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-10 h-10 rounded-full bg-surface-elevated border border-border-subtle flex items-center justify-center"
                  >
                    <svg
                      className="w-5 h-5 text-accent-green"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      />
                    </svg>
                  </motion.div>
                  <div className="flex-1 h-px bg-gradient-to-r from-accent-green/30 to-bitcoin/30" />
                </div>

                {/* Conversion steps */}
                <div className="flex items-center gap-3 my-6 ml-6">
                  <div className="flex items-center gap-2 bg-surface-elevated rounded-lg px-3 py-1.5 border border-border-subtle">
                    <div className="w-2 h-2 bg-accent-blue rounded-full" />
                    <span className="text-xs text-text-secondary">
                      Stablecoin
                    </span>
                  </div>
                  <svg
                    className="w-4 h-4 text-text-tertiary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                  <div className="flex items-center gap-2 bg-surface-elevated rounded-lg px-3 py-1.5 border border-border-subtle">
                    <div className="w-2 h-2 bg-accent-green rounded-full" />
                    <span className="text-xs text-text-secondary">
                      Settlement
                    </span>
                  </div>
                  <svg
                    className="w-4 h-4 text-text-tertiary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                  <div className="flex items-center gap-2 bg-surface-elevated rounded-lg px-3 py-1.5 border border-border-subtle">
                    <div className="w-2 h-2 bg-bitcoin rounded-full" />
                    <span className="text-xs text-text-secondary">INR</span>
                  </div>
                </div>

                {/* To */}
                <div className="flex items-center gap-4 mt-8">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-bitcoin to-bitcoin-light flex items-center justify-center text-2xl">
                    🇮🇳
                  </div>
                  <div>
                    <p className="text-sm text-text-tertiary">Received in</p>
                    <p className="font-semibold text-lg">India</p>
                    <p className="text-sm font-mono">
                      <span className="text-accent-green">₹83,500</span>
                      <span className="text-text-tertiary ml-2">
                        in minutes, not days
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right - Content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-accent-blue/10 border border-accent-blue/20 rounded-full px-4 py-1.5 mb-6"
            >
              <div className="w-2 h-2 bg-accent-blue rounded-full animate-pulse" />
              <span className="text-sm text-accent-blue font-medium">
                Now Live
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6"
            >
              The future of
              <br />
              <span className="gradient-text-bitcoin">
                cross-border payments.
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg text-text-secondary leading-relaxed mb-8"
            >
              Stablecoins are transforming how money moves across borders. We&apos;re
              building the rails — partnering with banks, NBFCs, and payment
              networks to make remittances instant, transparent, and dramatically
              cheaper.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="space-y-4 mb-10"
            >
              {[
                {
                  stat: "90%",
                  desc: "Lower fees than traditional wire transfers",
                },
                { stat: "Minutes", desc: "Not days — settlement in real-time" },
                {
                  stat: "24/7",
                  desc: "No banking hours, no holidays, always on",
                },
              ].map((item) => (
                <div
                  key={item.stat}
                  className="flex items-center gap-4 group"
                >
                  <span className="text-2xl font-bold text-bitcoin min-w-[80px]">
                    {item.stat}
                  </span>
                  <span className="text-text-secondary">{item.desc}</span>
                </div>
              ))}
            </motion.div>

            {/* Partner badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <p className="text-sm text-text-tertiary mb-3 uppercase tracking-wider">
                Growing Partner Network
              </p>
              <div className="flex flex-wrap gap-3">
                {partners.map((partner) => (
                  <div
                    key={partner}
                    className="bg-surface-elevated border border-border-subtle rounded-lg px-4 py-2 text-sm text-text-secondary"
                  >
                    {partner}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
