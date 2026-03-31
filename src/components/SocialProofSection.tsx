"use client";

import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useRef, useEffect } from "react";

const stats = [
  { value: 3000, prefix: "₹", suffix: " Cr+", label: "Transactions processed" },
  { value: 2.26, suffix: "M+", label: "Verified users" },
  { value: 13, suffix: " Years", label: "Continuous operation" },
  { value: 120, suffix: "+", label: "Cryptocurrencies" },
  { value: 99.9, suffix: "%", label: "Platform uptime" },
];

const testimonials = [
  {
    quote:
      "We evaluated every crypto platform in India. Unocoin\u2019s institutional infrastructure, regulatory compliance, and 13-year track record made it the only choice for our clients\u2019 portfolios.",
    role: "Senior Portfolio Manager",
    org: "Mumbai-based Family Office",
    initials: "SP",
  },
  {
    quote:
      "I\u2019ve been with Unocoin since 2014. Through the RBI ban, the Supreme Court case, through everything. There\u2019s a reason Tim Draper invested here \u2014 they don\u2019t quit.",
    role: "Tech Founder",
    org: "Bangalore",
    initials: "AK",
  },
  {
    quote:
      "Our settlement times went from 3-5 days to under 60 seconds. Lightning Network integration through Unocoin\u2019s API was seamless. The cost savings are staggering.",
    role: "Operations Head",
    org: "Cross-border Payments Company",
    initials: "RN",
  },
];

const mediaOutlets = [
  "Economic Times",
  "NDTV",
  "Bloomberg Quint",
  "Forbes India",
  "YourStory",
  "Inc42",
];

const credentials = [
  { icon: "\uD83D\uDEE1\uFE0F", label: "FIU-IND Registered" },
  { icon: "\u2696\uFE0F", label: "PMLA Compliant" },
  { icon: "\uD83E\uDDF3", label: "95% Cold Storage" },
  { icon: "\uD83D\uDD10", label: "Multi-Signature Wallets" },
  { icon: "\uD83D\uDCE1", label: "Real-time Transaction Monitoring" },
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
    Number.isInteger(value) ? `${prefix}${Math.round(v).toLocaleString("en-IN")}${suffix}` : `${prefix}${v.toFixed(1)}${suffix}`
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
    <section className="relative py-32 lg:py-40">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-bitcoin/[0.02] rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div ref={sectionRef} className="text-center max-w-3xl mx-auto mb-20">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-block text-bitcoin font-semibold text-sm tracking-widest uppercase mb-4"
          >
            Trusted Across India
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6"
          >
            2.26 million Indians don&apos;t just use Unocoin.
            <br />
            They <span className="gradient-text-bitcoin">trust it.</span>
          </motion.h2>
        </div>

        {/* Animated Stats Bar */}
        <div ref={statsRef} className="mb-24">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 24 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-surface-card border border-border-subtle rounded-2xl p-5 text-center hover:border-bitcoin/20 transition-colors duration-500"
              >
                <span className="text-2xl lg:text-3xl font-bold gradient-text-bitcoin block mb-1">
                  <AnimatedCounter
                    value={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    inView={statsInView}
                  />
                </span>
                <span className="text-xs text-text-tertiary">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-6 mb-24">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.role}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="relative bg-surface-card border border-border-subtle rounded-2xl p-6 hover:border-bitcoin/20 transition-colors duration-500"
            >
              <div className="absolute left-0 top-6 bottom-6 w-[3px] rounded-full bg-gradient-to-b from-bitcoin to-bitcoin-light opacity-40" />
              <p className="text-text-secondary text-sm leading-relaxed mb-6 pl-3">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3 pl-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-bitcoin/20 to-bitcoin-light/20 border border-bitcoin/10 flex items-center justify-center text-xs font-semibold text-bitcoin">
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">{t.role}</p>
                  <p className="text-xs text-text-tertiary">{t.org}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* As Seen In */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="text-center text-xs text-text-tertiary uppercase tracking-widest mb-6">
            As Seen In
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {mediaOutlets.map((name) => (
              <span
                key={name}
                className="bg-surface-elevated/60 border border-border-subtle rounded-lg px-4 py-2 text-sm text-text-secondary font-medium"
              >
                {name}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Security Credentials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-surface-card border border-border-subtle rounded-2xl p-6">
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-3">
              {credentials.map((cred) => (
                <div
                  key={cred.label}
                  className="flex items-center gap-2 text-sm text-text-secondary"
                >
                  <span className="text-base">{cred.icon}</span>
                  <span>{cred.label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
