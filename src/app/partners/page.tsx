"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const easing: [number, number, number, number] = [0.16, 1, 0.3, 1];

// ─── Animated block ───────────────────────────────────────
function AnimatedBlock({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: easing }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── App features ─────────────────────────────────────────
const appFeatures = [
  {
    title: "Bitcoin SBP",
    subtitle: "Systematic Buying Plan",
    description:
      "India's first Bitcoin SIP. Auto-invest in Bitcoin daily, weekly, or monthly. Zero transaction fees. Start from just ₹10.",
    stat: "₹0 fees",
    details: [
      "Set once, runs forever — no manual intervention",
      "Choose from daily, weekly, or monthly frequency",
      "Supports BTC and USDT",
      "Pause or cancel anytime with zero penalties",
    ],
  },
  {
    title: "Lightning Transfers",
    subtitle: "Send and receive in milliseconds",
    description:
      "Bitcoin transfers that settle faster than a UPI payment. Powered by Voltage infrastructure with 99.99% routing success. Cross-border remittances in under a second.",
    stat: "<1s",
    details: [
      "Instant Bitcoin transfers via Lightning Network",
      "Near-zero fees regardless of amount",
      "Cross-border settlements without correspondent banks",
      "24/7/365 availability — no banking hours",
    ],
  },
  {
    title: "USDT Earnings",
    subtitle: "Put idle stablecoins to work",
    description:
      "Earn up to 7% annual yield on your USDT holdings. No lock-in period. Withdraw anytime. Your money works while you sleep.",
    stat: "7% APY",
    details: [
      "Daily interest accrual on USDT balances",
      "No minimum holding period or lock-in",
      "Withdraw principal and earnings anytime",
      "Compounding returns for long-term holders",
    ],
  },
  {
    title: "Vault Security",
    subtitle: "Institutional-grade protection",
    description:
      "95% of all assets secured in air-gapped cold storage with multi-signature wallets. Biometric authentication. Zero security breaches in 13 years.",
    stat: "95%",
    details: [
      "Multi-signature cold storage wallets",
      "Biometric + 2FA authentication",
      "Real-time fraud monitoring and alerting",
      "Regular third-party security audits",
    ],
  },
];

const appScreens = [
  {
    title: "Portfolio Dashboard",
    description:
      "See your complete holdings at a glance. Real-time P&L, asset allocation breakdown, and performance history — all in one clean view.",
  },
  {
    title: "Instant Trade",
    description:
      "Buy or sell Bitcoin and USDT in under 3 taps. Live order book, limit orders, and instant market execution via UPI, IMPS, or NEFT.",
  },
  {
    title: "SBP Manager",
    description:
      "Set up, modify, and track all your Systematic Buying Plans. Visual progress toward goals. Automated recurring investments on your schedule.",
  },
  {
    title: "Auto Sell",
    description:
      "Generate a unique Bitcoin address that auto-converts incoming BTC to INR at zero fees. Perfect for freelancers and businesses receiving Bitcoin payments.",
  },
];

const stats = [
  { value: "2.26M+", label: "Users" },
  { value: "₹3,000 Cr+", label: "Volume Processed" },
  { value: "2", label: "Assets: BTC & USDT" },
  { value: "13 Years", label: "Track Record" },
  { value: "0", label: "Security Breaches" },
  { value: "99.99%", label: "Uptime" },
];

export default function AppPage() {
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });

  return (
    <main className="relative bg-surface text-text-primary">
      <Navigation />

      {/* Hero */}
      <section
        ref={heroRef}
        className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-bitcoin/[0.04] rounded-full blur-[200px]" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: easing }}
          >
            <p className="text-sm uppercase tracking-widest text-bitcoin mb-6">
              The IndiaBitcoin App
            </p>
            <h1
              className="font-bold tracking-tight mb-6"
              style={{
                fontSize: "clamp(2.25rem, 5vw, 3.75rem)",
                lineHeight: 1.08,
                letterSpacing: "-0.03em",
              }}
            >
              Buy, sell, and grow
              <br />
              <span className="gradient-text-bitcoin">
                your digital wealth
              </span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15, ease: easing }}
          >
            <p className="text-lg text-text-secondary max-w-2xl leading-relaxed mb-10">
              India&apos;s most trusted Bitcoin platform. Trade Bitcoin and USDT,
              auto-invest with SBP, earn yield on stablecoins, and send
              Bitcoin at lightning speed — all from one app.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                href="/autopilot"
                className="btn-primary !py-3.5 !px-8 rounded-xl text-lg"
              >
                Get Started
              </Link>
              <Link
                href="/platform"
                className="text-text-secondary hover:text-text-primary transition-colors flex items-center gap-2 text-lg py-3.5 px-2"
              >
                See AI features →
              </Link>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-6">
              {stats.map((s) => (
                <div key={s.label}>
                  <span className="text-xl font-bold gradient-text-bitcoin block">
                    {s.value}
                  </span>
                  <span className="text-xs text-text-tertiary">{s.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-24 lg:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedBlock>
            <p className="text-sm uppercase tracking-widest text-bitcoin mb-6">
              Core Features
            </p>
            <h2
              className="font-bold tracking-tight mb-20"
              style={{
                fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
                lineHeight: 1.12,
                letterSpacing: "-0.02em",
              }}
            >
              Everything you need to invest
            </h2>
          </AnimatedBlock>

          {appFeatures.map((feature, i) => (
            <div
              key={feature.title}
              className={`py-16 lg:py-24 ${i < appFeatures.length - 1 ? "border-b border-border-subtle" : ""}`}
            >
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
                <AnimatedBlock>
                  <p className="text-xs uppercase tracking-widest text-text-tertiary mb-3">
                    {feature.subtitle}
                  </p>
                  <h3
                    className="font-bold tracking-tight mb-4"
                    style={{
                      fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                      lineHeight: 1.15,
                    }}
                  >
                    {feature.title}
                  </h3>
                  <p className="text-text-secondary leading-relaxed">
                    {feature.description}
                  </p>
                </AnimatedBlock>
                <AnimatedBlock delay={0.1}>
                  <span
                    className="gradient-text-bitcoin font-bold block mb-8"
                    style={{
                      fontSize: "clamp(3rem, 8vw, 6rem)",
                      lineHeight: 1,
                    }}
                  >
                    {feature.stat}
                  </span>
                  <ul className="space-y-3">
                    {feature.details.map((detail) => (
                      <li
                        key={detail}
                        className="flex items-start gap-3 text-sm text-text-secondary"
                      >
                        <span className="w-1.5 h-1.5 bg-bitcoin rounded-full mt-1.5 shrink-0" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </AnimatedBlock>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* App Screens */}
      <section className="bg-surface-elevated/50 py-24 lg:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedBlock>
            <p className="text-sm uppercase tracking-widest text-bitcoin mb-6">
              Inside the App
            </p>
            <h2
              className="font-bold tracking-tight mb-16"
              style={{
                fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
                lineHeight: 1.12,
                letterSpacing: "-0.02em",
              }}
            >
              Designed for clarity
            </h2>
          </AnimatedBlock>

          <div className="grid sm:grid-cols-2 gap-12 lg:gap-16">
            {appScreens.map((screen, i) => (
              <AnimatedBlock key={screen.title} delay={i * 0.08}>
                <h3 className="text-xl font-semibold mb-2 text-text-primary">
                  {screen.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {screen.description}
                </p>
              </AnimatedBlock>
            ))}
          </div>
        </div>
      </section>

      {/* How SBP Works */}
      <section className="py-24 lg:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedBlock>
            <p className="text-sm uppercase tracking-widest text-bitcoin mb-6">
              How SBP Works
            </p>
            <h2
              className="font-bold tracking-tight mb-16"
              style={{
                fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
                lineHeight: 1.12,
                letterSpacing: "-0.02em",
              }}
            >
              Set it once. Build wealth forever.
            </h2>
          </AnimatedBlock>

          <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
            {[
              {
                step: "01",
                title: "Choose your asset",
                desc: "Pick from Bitcoin or USDT.",
              },
              {
                step: "02",
                title: "Set amount and frequency",
                desc: "Start from ₹10. Choose daily, weekly, or monthly auto-investment. Zero fees on every SBP trade.",
              },
              {
                step: "03",
                title: "Watch it grow",
                desc: "Your SBP runs automatically. Rupee-cost averaging smooths out volatility. Track progress in real time.",
              },
            ].map((item, i) => (
              <AnimatedBlock key={item.step} delay={i * 0.1}>
                <span className="text-5xl font-bold gradient-text-bitcoin block mb-4">
                  {item.step}
                </span>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {item.desc}
                </p>
              </AnimatedBlock>
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="bg-surface-elevated/50 py-24 lg:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedBlock>
            <p className="text-sm uppercase tracking-widest text-bitcoin mb-6">
              Trust
            </p>
            <h2
              className="font-bold tracking-tight mb-12"
              style={{
                fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
                lineHeight: 1.12,
                letterSpacing: "-0.02em",
              }}
            >
              13 years. Zero compromises.
            </h2>
            <p className="text-text-secondary max-w-2xl leading-relaxed mb-16">
              IndiaBitcoin is India&apos;s oldest Bitcoin platform. FIU-IND
              registered. PMLA compliant. Trusted by sovereign entities, family
              offices, and 2.26 million individuals. We fought the RBI in the
              Supreme Court — and won.
            </p>
          </AnimatedBlock>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-8">
            {[
              {
                label: "Registration",
                value: "FIU-IND Registered",
              },
              {
                label: "Compliance",
                value: "PMLA & FEMA Compliant",
              },
              {
                label: "Asset Security",
                value: "95% Cold Storage",
              },
              {
                label: "Authentication",
                value: "Biometric + 2FA",
              },
              {
                label: "Investors",
                value: "Draper, Silbert, Blume",
              },
              {
                label: "Legal",
                value: "Supreme Court Validated",
              },
            ].map((item, i) => (
              <AnimatedBlock key={item.label} delay={i * 0.05}>
                <p className="text-xs uppercase tracking-widest text-text-tertiary mb-1">
                  {item.label}
                </p>
                <p className="text-lg font-semibold text-text-primary">
                  {item.value}
                </p>
              </AnimatedBlock>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 lg:py-48">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <AnimatedBlock>
            <h2
              className="font-bold tracking-tight mb-6"
              style={{
                fontSize: "clamp(2rem, 4vw, 3rem)",
                lineHeight: 1.1,
                letterSpacing: "-0.03em",
              }}
            >
              Start building wealth
              <br />
              <span className="gradient-text-bitcoin">with ₹10</span>
            </h2>
            <p className="text-text-secondary max-w-lg mx-auto mb-10">
              Join 2.26 million Indians on India&apos;s most trusted Bitcoin
              platform. Free account. Zero SBP fees. No lock-in.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/autopilot"
                className="btn-primary !py-4 !px-10 !rounded-xl text-lg"
              >
                Get Started Free
              </Link>
              <Link
                href="/platform"
                className="text-sm text-text-tertiary hover:text-text-primary transition-colors"
              >
                Explore AI features →
              </Link>
            </div>
            <p className="text-xs text-text-tertiary mt-6">
              FIU-IND Registered · PMLA Compliant · 95% Cold Storage
            </p>
          </AnimatedBlock>
        </div>
      </section>

      <Footer />
    </main>
  );
}
