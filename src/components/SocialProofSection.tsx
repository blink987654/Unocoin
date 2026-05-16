"use client";

import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useRef, useEffect } from "react";

const stats = [
  { value: 3000, prefix: "₹", suffix: " Cr+", label: "Transactions processed" },
  { value: 2.65, suffix: "M+", label: "Verified users" },
  { value: 13, label: "Years of operation" },
  { value: 2, suffix: "", label: "Assets: BTC & USDT" },
  { value: 99.9, suffix: "%", label: "Platform uptime" },
];

const testimonial = {
  quote:
    "We evaluated every platform in India. IndiaBitcoin's institutional infrastructure, regulatory compliance, and 13-year track record made it the only choice for our clients' portfolios.",
  name: "Senior Portfolio Manager",
  title: "Mumbai-based Family Office",
};

const trustCredentials = [
  "FIU-IND Registered",
  "PMLA Compliant",
  "95% Cold Storage",
  "Supreme Court Validated",
  "Zero Security Breaches",
];

function AnimatedCounter({
  value,
  prefix = "",
  suffix = "",
  inView,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  inView: boolean;
}) {
  const count = useMotionValue(0);
  const display = useTransform(count, (v) =>
    Number.isInteger(value)
      ? `${prefix}${Math.round(v).toLocaleString("en-IN")}${suffix}`
      : `${prefix}${v.toFixed(1)}${suffix}`
  );

  useEffect(() => {
    if (inView) {
      const controls = animate(count, value, { duration: 2, ease: "easeOut" });
      return controls.stop;
    }
  }, [inView, count, value]);

  return <motion.span>{display}</motion.span>;
}

export default function SocialProofSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-50px" });

  return (
    <section id="about" className="relative py-40 lg:py-56">
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Label */}
        <div ref={sectionRef} className="mb-24">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-sm uppercase tracking-widest text-bitcoin mb-8"
          >
            Why IndiaBitcoin
          </motion.p>
        </div>

        {/* Part 1: Stats Bar */}
        <div ref={statsRef} className="mb-32">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-y-12 gap-x-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 24 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <span className="text-4xl lg:text-5xl font-bold text-text-primary block mb-2">
                  <AnimatedCounter
                    value={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    inView={statsInView}
                  />
                </span>
                <span className="text-sm text-text-tertiary">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Part 2: Investor + Press Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-32 py-12 text-center"
        >
          <p className="text-base lg:text-lg font-medium text-text-primary mb-3">
            Backed by Tim Draper
            <span className="mx-2 text-text-tertiary">&middot;</span>
            Barry Silbert
            <span className="mx-2 text-text-tertiary">&middot;</span>
            Blume Ventures
          </p>
          <p className="text-sm text-text-tertiary">
            As seen in Economic Times
            <span className="mx-2">&middot;</span>
            NDTV
            <span className="mx-2">&middot;</span>
            Bloomberg Quint
            <span className="mx-2">&middot;</span>
            Forbes India
          </p>
        </motion.div>

        {/* Part 3: Trust Narrative */}
        <div className="text-center">
          {/* Testimonial */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl mx-auto mb-16"
          >
            <p className="text-2xl lg:text-3xl italic text-text-primary leading-relaxed mb-8">
              &ldquo;{testimonial.quote}&rdquo;
            </p>
            <p className="text-sm text-text-tertiary">
              {testimonial.name}
              <span className="mx-2">&middot;</span>
              {testimonial.title}
            </p>
          </motion.div>

          {/* Trust Credentials */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm text-text-tertiary"
          >
            {trustCredentials.map((cred, i) => (
              <span key={cred}>
                {cred}
                {i < trustCredentials.length - 1 && (
                  <span className="mx-2">&middot;</span>
                )}
              </span>
            ))}
          </motion.p>
        </div>
      </div>
    </section>
  );
}
