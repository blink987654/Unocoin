"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const timeline = [
  {
    year: "2013",
    title: "The Beginning",
    desc: "Founded as India's first dedicated Bitcoin platform. When no one believed, we built.",
  },
  {
    year: "2014",
    title: "Draper & Silbert Invest",
    desc: "Tim Draper and Barry Silbert back Unocoin — legendary Bitcoin investors who saw the vision early.",
  },
  {
    year: "2018",
    title: "RBI Banking Ban",
    desc: "The Reserve Bank banned crypto banking. Many folded. We fought back.",
  },
  {
    year: "2020",
    title: "Supreme Court Victory",
    desc: "Led the initiative that overturned the RBI ban in India's Supreme Court. A landmark win for crypto freedom.",
  },
  {
    year: "2024",
    title: "FIU Registration",
    desc: "Fully compliant and registered with India's Financial Intelligence Unit. Building trust through regulation.",
  },
  {
    year: "2026",
    title: "Remittance Revolution",
    desc: "Pioneering stablecoin-powered cross-border payments. The next chapter begins.",
  },
];

const stats = [
  { value: "13+", label: "Years of Trust", icon: "🕐" },
  { value: "2M+", label: "Users Served", icon: "👥" },
  { value: "₹10K Cr+", label: "Volume Processed", icon: "📊" },
  { value: "100%", label: "Cold Storage Security", icon: "🔒" },
];

function TimelineItem({
  item,
  index,
  isLast,
}: {
  item: (typeof timeline)[0];
  index: number;
  isLast: boolean;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="relative pl-8 pb-10 group"
    >
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-[11px] top-8 bottom-0 w-px bg-gradient-to-b from-border-medium to-transparent" />
      )}

      {/* Timeline dot */}
      <div className="absolute left-0 top-1.5 w-[23px] h-[23px] rounded-full border-2 border-border-medium bg-surface flex items-center justify-center group-hover:border-bitcoin transition-colors duration-300">
        <div className="w-2 h-2 rounded-full bg-bitcoin opacity-60 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Content */}
      <div>
        <span className="text-sm font-mono text-bitcoin font-semibold">
          {item.year}
        </span>
        <h4 className="text-lg font-semibold mt-1 mb-1">{item.title}</h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          {item.desc}
        </p>
      </div>
    </motion.div>
  );
}

export default function TrustSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-50px" });

  return (
    <section id="about" className="relative py-32 lg:py-40">
      {/* Background */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[1000px] h-[600px] bg-bitcoin/[0.03] rounded-full blur-[150px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <div ref={ref} className="text-center max-w-3xl mx-auto mb-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-bitcoin font-semibold text-sm tracking-widest uppercase mb-4"
          >
            Our Story
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6"
          >
            13 years of building
            <br />
            <span className="gradient-text-bitcoin">what others wouldn&apos;t.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-text-secondary leading-relaxed"
          >
            When banks shut us down, we took it to the Supreme Court — and won.
            When others pivoted to meme coins, we stayed true to Bitcoin. This
            isn&apos;t just a company. It&apos;s a movement.
          </motion.p>
        </div>

        {/* Stats bar */}
        <div ref={statsRef} className="mb-24">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="bg-surface-card border border-border-subtle rounded-2xl p-6 text-center hover:border-bitcoin/20 transition-colors duration-500"
              >
                <span className="text-2xl mb-3 block">{stat.icon}</span>
                <span className="text-3xl lg:text-4xl font-bold gradient-text-bitcoin block mb-1">
                  {stat.value}
                </span>
                <span className="text-sm text-text-tertiary">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Timeline + Investors */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Timeline */}
          <div>
            <h3 className="text-2xl font-bold mb-8">The Journey</h3>
            <div>
              {timeline.map((item, i) => (
                <TimelineItem
                  key={item.year}
                  item={item}
                  index={i}
                  isLast={i === timeline.length - 1}
                />
              ))}
            </div>
          </div>

          {/* Investors & Recognition */}
          <div>
            <h3 className="text-2xl font-bold mb-8">Backed by Legends</h3>

            {/* Investor cards */}
            <div className="space-y-4 mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-surface-card border border-border-subtle rounded-2xl p-6 hover:border-bitcoin/20 transition-colors duration-500"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-bitcoin to-bitcoin-light flex items-center justify-center font-bold text-lg text-white">
                    TD
                  </div>
                  <div>
                    <h4 className="font-semibold">Tim Draper</h4>
                    <p className="text-sm text-text-tertiary">
                      Legendary VC & Bitcoin Pioneer
                    </p>
                  </div>
                </div>
                <p className="text-text-secondary text-sm leading-relaxed">
                  Early Skype, Tesla, and Coinbase investor. Bought 30,000 BTC
                  at the US Marshals auction. Predicted Bitcoin at $250K. Believed
                  in Unocoin&apos;s mission to bring Bitcoin to India.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-surface-card border border-border-subtle rounded-2xl p-6 hover:border-bitcoin/20 transition-colors duration-500"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center font-bold text-lg text-white">
                    BS
                  </div>
                  <div>
                    <h4 className="font-semibold">Barry Silbert</h4>
                    <p className="text-sm text-text-tertiary">
                      Founder, Digital Currency Group
                    </p>
                  </div>
                </div>
                <p className="text-text-secondary text-sm leading-relaxed">
                  Founder of DCG, the most prolific investor in the Bitcoin and
                  blockchain industry. Grayscale, CoinDesk, Genesis — his
                  portfolio defines the ecosystem. Unocoin is part of that vision.
                </p>
              </motion.div>
            </div>

            {/* Supreme Court highlight */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative gradient-border bg-surface-card rounded-2xl p-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-green to-accent-blue flex items-center justify-center text-xl shrink-0">
                  ⚖️
                </div>
                <div>
                  <h4 className="font-semibold mb-2">
                    Supreme Court of India — 2020
                  </h4>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    When the RBI banned cryptocurrency banking in 2018, the
                    industry was devastated. Unocoin helped lead the fight that
                    resulted in the Supreme Court striking down the ban — a
                    historic ruling that saved India&apos;s crypto future and set
                    precedent for digital asset rights worldwide.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
